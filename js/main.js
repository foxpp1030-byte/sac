document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // 1. 메인 비주얼 슬라이더 (무한 롤링)
    // ------------------------------------
    const sliderContainer = document.querySelector('.visual_container');
    const slides = document.querySelectorAll('.visual_item');
    const slideCount = slides.length; // HTML에 복제본 포함 4개

    if (sliderContainer && slideCount > 0) {
        let currentIndex = 0;
        const intervalTime = 5000; // 5초

        function nextSlide() {
            if (currentIndex >= slideCount - 1) return;
            currentIndex++;
            sliderContainer.style.transition = 'transform 0.8s ease-in-out';
            const translateValue = -(currentIndex * 25);
            sliderContainer.style.transform = `translateX(${translateValue}%)`;

            // 마지막(복제본) 도달 시 리셋
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
    // 2. 무한 루프 캐러셀 설정 함수 (Upcoming, Story 공용)
    // ------------------------------------
    function setupInfiniteCarousel(trackSelector, btnPrevSelector, btnNextSelector, itemSelector, visibleCount, gap) {
        const track = document.querySelector(trackSelector);
        const btnPrev = document.querySelector(btnPrevSelector);
        const btnNext = document.querySelector(btnNextSelector);

        if (!track || !btnPrev || !btnNext) return;

        const items = track.querySelectorAll(itemSelector);
        const originalCount = items.length;
        const itemWidth = items[0].offsetWidth; // 아이템 너비
        const moveAmount = itemWidth + gap; // 이동 거리

        // 앞뒤로 클론 생성
        for (let i = 0; i < visibleCount; i++) {
            const clone = items[i].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }
        for (let i = originalCount - 1; i >= originalCount - visibleCount; i--) {
            const clone = items[i].cloneNode(true);
            clone.classList.add('clone');
            track.insertBefore(clone, track.firstChild);
        }

        // 초기 위치 설정
        let currentIndex = visibleCount;
        track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;

        let isTransitioning = false;

        function updatePosition(useTransition = true) {
            if (useTransition) {
                track.style.transition = 'transform 0.5s ease-in-out';
            } else {
                track.style.transition = 'none';
            }
            track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
        }

        btnNext.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updatePosition();
        });

        btnPrev.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex--;
            updatePosition();
        });

        track.addEventListener('transitionend', () => {
            isTransitioning = false;

            if (currentIndex >= originalCount + visibleCount) {
                currentIndex = visibleCount;
                updatePosition(false);
            }
            if (currentIndex < visibleCount) {
                currentIndex = currentIndex + originalCount;
                updatePosition(false);
            }
        });
    }

    // Upcoming 섹션 적용
    setupInfiniteCarousel('.upcoming_track', '.btn_prev_upcoming', '.btn_next_upcoming', '.upcoming_card', 3, 40);

    // Story 섹션 적용
    setupInfiniteCarousel('.story_track', '.btn_prev_story', '.btn_next_story', '.story_item', 4, 40);


    // ------------------------------------
    // 3. News 탭 기능 추가
    // ------------------------------------
    const tabBtns = document.querySelectorAll('.tab_btn');
    const boardLists = document.querySelectorAll('.board_list');

    if (tabBtns.length > 0 && boardLists.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');

                // 1. 모든 버튼 active 제거
                tabBtns.forEach(b => b.classList.remove('active'));
                // 2. 클릭한 버튼 active 추가
                e.target.classList.add('active');

                // 3. 모든 리스트 숨김
                boardLists.forEach(list => list.classList.remove('active'));
                // 4. 해당 리스트 보임
                const targetList = document.getElementById(`tab-${targetTab}`);
                if (targetList) targetList.classList.add('active');
            });
        });
    }
});