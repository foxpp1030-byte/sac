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
    // 2. 무한 루프 캐러셀 (Upcoming & Story 개선)
    // ------------------------------------
    // [수정] 끊김 없는 무한 스크롤을 위한 로직 개선
    function setupInfiniteCarousel(trackSelector, btnPrevSelector, btnNextSelector, itemSelector, gap = 40, autoPlay = true) {
        const track = document.querySelector(trackSelector);
        const prevBtn = document.querySelector(btnPrevSelector);
        const nextBtn = document.querySelector(btnNextSelector);
        if (!track || !prevBtn || !nextBtn) return;

        let items = Array.from(track.querySelectorAll(itemSelector));
        if (items.length === 0) return;

        // 아이템의 실제 너비 계산 (margin 포함)
        const itemWidth = items[0].offsetWidth + gap;

        // 앞뒤로 복제할 개수 (화면에 꽉 찰 정도로 충분히)
        const cloneCount = 3;

        // 1. 뒤쪽에 복제 (Start Clones at End)
        for (let i = 0; i < cloneCount; i++) {
            const clone = items[i].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }
        // 2. 앞쪽에 복제 (End Clones at Start)
        for (let i = items.length - 1; i >= items.length - cloneCount; i--) {
            const clone = items[i].cloneNode(true);
            clone.classList.add('clone');
            track.insertBefore(clone, track.firstChild);
        }

        // 현재 인덱스는 앞쪽 복제본 개수부터 시작 (실제 첫 아이템)
        let currentIndex = cloneCount;
        let isAnimating = false;
        let autoPlayInterval;

        // 초기 위치 설정 (애니메이션 없이)
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

        // 위치 업데이트 함수
        function updatePosition(useTransition = true) {
            if (useTransition) {
                track.style.transition = 'transform 0.5s ease-in-out';
            } else {
                track.style.transition = 'none';
            }
            track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }

        // 다음 버튼 클릭
        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            currentIndex++;
            updatePosition(true);

            // 애니메이션 끝난 후 처리
            setTimeout(() => {
                // 만약 마지막 복제본(끝)에 도달했다면 -> 실제 첫 아이템 위치로 이동 (순간이동)
                if (currentIndex >= items.length + cloneCount) {
                    currentIndex = cloneCount;
                    updatePosition(false);
                }
                isAnimating = false;
            }, 500); // transition 시간과 일치
        });

        // 이전 버튼 클릭
        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            currentIndex--;
            updatePosition(true);

            setTimeout(() => {
                // 만약 앞쪽 복제본(처음)에 도달했다면 -> 실제 마지막 아이템 위치로 이동 (순간이동)
                if (currentIndex < cloneCount) {
                    currentIndex = items.length + cloneCount - 1;
                    updatePosition(false);
                }
                isAnimating = false;
            }, 500);
        });

        // 자동 재생 (옵션)
        if (autoPlay) {
            function startAutoPlay() {
                autoPlayInterval = setInterval(() => {
                    nextBtn.click();
                }, 3000);
            }

            startAutoPlay();

            // 마우스 올리면 멈춤
            track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            track.parentElement.addEventListener('mouseleave', () => startAutoPlay());
        }
    }

    // [실행] Upcoming 섹션: 자동 재생 켬
    setupInfiniteCarousel('.upcoming_track', '.btn_prev_upcoming', '.btn_next_upcoming', '.upcoming_card', 40, true);

    // [실행] Story 섹션: 자동 재생 끔 (클릭 시에만 이동)
    setupInfiniteCarousel('.story_track', '.btn_prev_story', '.btn_next_story', '.story_item', 40, false);


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