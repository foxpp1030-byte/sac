document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // 1. 메인 비주얼 슬라이더 (기존 유지)
    // ------------------------------------
    const sliderContainer = document.querySelector('.visual_container');
    const slides = document.querySelectorAll('.visual_item');
    const slideCount = slides.length;

    if (sliderContainer && slideCount > 0) {
        let currentIndex = 0;
        const intervalTime = 5000;

        function nextSlide() {
            if (currentIndex >= slideCount - 1) return;
            currentIndex++;
            sliderContainer.style.transition = 'transform 0.8s ease-in-out';
            const translateValue = -(currentIndex * 25);
            sliderContainer.style.transform = `translateX(${translateValue}%)`;

            if (currentIndex === slideCount - 1) {
                setTimeout(() => {
                    sliderContainer.style.transition = 'none';
                    currentIndex = 0;
                    sliderContainer.style.transform = `translateX(0%)`;
                }, 800);
            }
        }
        setInterval(nextSlide, intervalTime);
    }

    // ------------------------------------
    // 2. 부드러운 흐름의 캐러셀 (Upcoming 전용)
    // ------------------------------------
    function setupFlowCarousel(trackSelector, btnPrevSelector, btnNextSelector, itemSelector, gap = 40) {
        const track = document.querySelector(trackSelector);
        const btnPrev = document.querySelector(btnPrevSelector);
        const btnNext = document.querySelector(btnNextSelector);

        if (!track || !btnPrev || !btnNext) return;

        let items = Array.from(track.querySelectorAll(itemSelector));
        if (items.length === 0) return;

        const itemWidth = items[0].offsetWidth;
        const singleMove = itemWidth + gap;
        const totalOriginalWidth = items.length * singleMove;

        // 무한 루프를 위해 아이템 복제 (충분히 많이)
        // 화면 너비를 커버하고도 남을 만큼 복제
        const cloneCount = 4;
        for (let i = 0; i < cloneCount; i++) {
            items.forEach(item => {
                const clone = item.cloneNode(true);
                clone.classList.add('clone'); // 식별용
                track.appendChild(clone);
            });
        }

        // 상태 변수
        let currentOffset = 0;
        const speed = 0.8; // 자연스럽게 흐르는 속도
        let isAnimating = true;
        let animationFrameId;
        let isSnapping = false; // 버튼 클릭 등으로 스냅 이동 중인지

        // 애니메이션 루프
        function loop() {
            if (isAnimating && !isSnapping) {
                currentOffset += speed;

                // 루프 리셋 지점 (원본 세트 길이만큼 이동했을 때)
                if (currentOffset >= totalOriginalWidth) {
                    currentOffset -= totalOriginalWidth;
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
            isAnimating = false; // 자동 이동 잠시 멈춤

            // 현재 위치 기준 가장 가까운 카드 인덱스 찾기
            // direction: 1 (Next), -1 (Prev)
            const currentIndex = Math.round(currentOffset / singleMove);
            let targetIndex = currentIndex + direction;

            // 목표 위치 계산
            let targetOffset = targetIndex * singleMove;

            // 부드러운 이동 (CSS transition 활용을 위해 일시적으로 트랙 스타일 변경)
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${targetOffset}px)`;

            // 이동 완료 후 처리
            setTimeout(() => {
                track.style.transition = 'none'; // 트랜지션 해제

                // 논리적 위치 업데이트 및 범위 보정
                currentOffset = targetOffset;

                // 범위 벗어났을 경우 리셋 (무한 스크롤 유지)
                if (currentOffset < 0) {
                    currentOffset += totalOriginalWidth;
                    track.style.transform = `translateX(-${currentOffset}px)`;
                } else if (currentOffset >= totalOriginalWidth) {
                    currentOffset -= totalOriginalWidth;
                    track.style.transform = `translateX(-${currentOffset}px)`;
                }

                isSnapping = false;
                isAnimating = true; // 자동 이동 재개
            }, 500);
        }

        // 이벤트 리스너
        btnNext.addEventListener('click', () => snapMove(1));
        btnPrev.addEventListener('click', () => snapMove(-1));

        // 마우스 호버 시 멈춤
        track.addEventListener('mouseenter', () => { isAnimating = false; });
        track.addEventListener('mouseleave', () => { if (!isSnapping) isAnimating = true; });
    }

    // Upcoming 섹션 실행
    setupFlowCarousel('.upcoming_track', '.btn_prev_upcoming', '.btn_next_upcoming', '.upcoming_card', 40);

    // Story 섹션도 동일 로직 적용 (필요시 별도 함수 분리 가능)
    setupFlowCarousel('.story_track', '.btn_prev_story', '.btn_next_story', '.story_item', 40);


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