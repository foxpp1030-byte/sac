document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // 1. 메인 비주얼 슬라이더 (점 Pagination 추가)
    // ------------------------------------
    const sliderContainer = document.querySelector('.visual_container');
    const slides = document.querySelectorAll('.visual_item');
    const paginationContainer = document.querySelector('.visual_pagination');
    const slideCount = slides.length; // 4 (3 real + 1 clone)
    const realSlideCount = slideCount > 0 ? slideCount - 1 : 0; // Clone 제외한 실제 슬라이드 개수

    if (sliderContainer && slideCount > 0) {
        let currentIndex = 0;
        const intervalTime = 5000;
        let sliderInterval;

        // 1-1. Pagination 점 생성
        if (paginationContainer) {
            for (let i = 0; i < realSlideCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('pagination_dot');
                if (i === 0) dot.classList.add('active'); // 첫 번째 활성화

                // 클릭 이벤트 추가
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
                paginationContainer.appendChild(dot);
            }
        }

        function updateDots(index) {
            const dots = document.querySelectorAll('.pagination_dot');
            dots.forEach(d => d.classList.remove('active'));

            // Clone(마지막 인덱스)일 경우 첫 번째 점 활성화
            const activeIndex = index >= realSlideCount ? 0 : index;
            if (dots[activeIndex]) {
                dots[activeIndex].classList.add('active');
            }
        }

        function nextSlide() {
            if (currentIndex >= slideCount - 1) return;
            currentIndex++;
            updateSlider();

            if (currentIndex === slideCount - 1) {
                setTimeout(() => {
                    sliderContainer.style.transition = 'none';
                    currentIndex = 0;
                    sliderContainer.style.transform = `translateX(0%)`;
                }, 800);
            }
            updateDots(currentIndex);
        }

        function updateSlider() {
            sliderContainer.style.transition = 'transform 0.8s ease-in-out';
            const translateValue = -(currentIndex * 25); // 4개 기준 25%씩 이동
            sliderContainer.style.transform = `translateX(${translateValue}%)`;
        }

        // 특정 슬라이드로 이동 (Dot 클릭 시)
        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
            updateDots(index);
            // 자동 슬라이드 타이머 재설정
            clearInterval(sliderInterval);
            sliderInterval = setInterval(nextSlide, intervalTime);
        }

        // 자동 실행 시작
        sliderInterval = setInterval(nextSlide, intervalTime);
    }

    // ------------------------------------
    // 2. 부드러운 흐름의 캐러셀 (Upcoming & Story)
    // ------------------------------------
    function setupFlowCarousel(trackSelector, btnPrevSelector, btnNextSelector, itemSelector, gap = 40, autoPlay = true) {
        const track = document.querySelector(trackSelector);
        const btnPrev = document.querySelector(btnPrevSelector);
        const btnNext = document.querySelector(btnNextSelector);

        if (!track || !btnPrev || !btnNext) return;

        let items = Array.from(track.querySelectorAll(itemSelector));
        if (items.length === 0) return;

        const itemWidth = items[0].offsetWidth;
        const singleMove = itemWidth + gap;
        const originalLength = items.length;
        const totalOriginalWidth = originalLength * singleMove;

        // [수정] 무한 스크롤 끊김 방지를 위한 복제 개수 및 로직 개선
        // 앞뒤로 충분히 복제하여 뷰포트를 커버하고 자연스러운 루프 유도

        // 1. 기존 아이템들을 뒤에 복제 (End Clones) - 충분히 많이
        const cloneCount = 6;
        for (let i = 0; i < cloneCount; i++) {
            // 원본 순서대로 복제하여 뒤에 붙임 (A B C D -> A' B' C' D')
            // 인덱스 모듈러 연산으로 원본 아이템을 순환하며 복제
            const sourceItem = items[i % originalLength];
            const clone = sourceItem.cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }

        // 상태 변수
        let currentOffset = 0;
        const speed = 0.8;
        let isAnimating = true;
        let animationFrameId;
        let isSnapping = false;

        // 애니메이션 루프
        function loop() {
            if (isAnimating && !isSnapping && autoPlay) {
                currentOffset += speed;

                // [핵심] 리셋 포인트 도달 시 '순간 이동' (Transition 없이)
                // totalOriginalWidth 지점에 도달하면, 
                // 화면상 보이는 것은 복제된 첫 번째 아이템(A')이므로
                // 실제 첫 번째 아이템(A) 위치인 0으로 되돌려도 시각적 변화 없음
                if (currentOffset >= totalOriginalWidth) {
                    currentOffset = 0; // 0으로 즉시 리셋
                }

                track.style.transform = `translateX(-${currentOffset}px)`;
            }
            animationFrameId = requestAnimationFrame(loop);
        }

        // 초기 시작
        animationFrameId = requestAnimationFrame(loop);

        // 버튼 클릭 시 이동 함수 (Snap Move)
        function snapMove(direction) {
            isSnapping = true;
            isAnimating = false;

            const currentIndex = Math.round(currentOffset / singleMove);
            let targetIndex = currentIndex + direction;
            let targetOffset = targetIndex * singleMove;

            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${targetOffset}px)`;

            setTimeout(() => {
                track.style.transition = 'none';

                // 이동 완료 후 논리적 위치 재계산
                currentOffset = targetOffset;

                // [수정] 범위 보정 로직 (순환 처리)
                if (currentOffset < 0) {
                    // 왼쪽 끝(0)보다 더 왼쪽으로 갔을 때 -> 맨 뒤쪽의 해당 아이템 위치로 이동
                    // 예: A에서 왼쪽 누름 -> D' 위치로
                    currentOffset = totalOriginalWidth - singleMove;
                    track.style.transform = `translateX(-${currentOffset}px)`;
                } else if (currentOffset >= totalOriginalWidth) {
                    // 오른쪽 끝(복제본 시작점)을 넘어갔을 때 -> 맨 앞(0)으로 이동
                    currentOffset = currentOffset - totalOriginalWidth;
                    track.style.transform = `translateX(-${currentOffset}px)`;
                }

                isSnapping = false;
                isAnimating = true;
            }, 500);
        }

        // 이벤트 리스너
        btnNext.addEventListener('click', () => snapMove(1));
        btnPrev.addEventListener('click', () => snapMove(-1));

        // 마우스 호버 시 멈춤
        track.addEventListener('mouseenter', () => { isAnimating = false; });
        track.addEventListener('mouseleave', () => { if (!isSnapping) isAnimating = true; });
    }

    // [실행] Upcoming 섹션: 자동 재생 켬 (true)
    setupFlowCarousel('.upcoming_track', '.btn_prev_upcoming', '.btn_next_upcoming', '.upcoming_card', 40, true);

    // [실행] Story 섹션: 자동 재생 끔 (false) - 화살표 클릭 시에만 이동
    setupFlowCarousel('.story_track', '.btn_prev_story', '.btn_next_story', '.story_item', 40, false);


    // ------------------------------------
    // 3. News 탭 기능 (기존 유지)
    // ------------------------------------
    const tabBtns = document.querySelectorAll('.tab_btn');
    const boardLists = document.querySelectorAll('.board_list');

    if (tabBtns.length > 0 && boardLists.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');
                tabBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                boardLists.forEach(list => list.classList.remove('active'));
                const targetList = document.getElementById(`tab-${targetTab}`);
                if (targetList) targetList.classList.add('active');
            });
        });
    }
});