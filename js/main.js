document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // 1. 메인 비주얼 슬라이더 (무한 롤링 - 기존 유지)
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
        const itemWidth = items[0].offsetWidth; // 아이템 너비 (CSS에서 고정됨)
        const moveAmount = itemWidth + gap; // 이동 거리

        // 1. 앞뒤로 클론 생성 (무한 루프를 위해)
        // 보이는 개수만큼 뒤에 복사, 앞에 복사
        // 부드러운 연결을 위해 visibleCount만큼 앞뒤로 복제

        // 뒤에 복제 (For next loop)
        for (let i = 0; i < visibleCount; i++) {
            const clone = items[i].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }
        // 앞에 복제 (For prev loop)
        for (let i = originalCount - 1; i >= originalCount - visibleCount; i--) {
            const clone = items[i].cloneNode(true);
            clone.classList.add('clone');
            track.insertBefore(clone, track.firstChild);
        }

        // 2. 초기 위치 설정
        // 앞에 visibleCount만큼 붙였으므로, 실제 첫 번째 아이템은 visibleCount 인덱스에 위치
        let currentIndex = visibleCount;

        // 초기 transform 설정
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

            // 마지막 클론(복제된 첫 번째 세트)에 도달했을 때 -> 진짜 첫 번째로 순간 이동
            if (currentIndex >= originalCount + visibleCount) {
                currentIndex = visibleCount;
                updatePosition(false);
            }

            // 첫 번째 클론(복제된 마지막 세트)에 도달했을 때 -> 진짜 마지막으로 순간 이동
            if (currentIndex < visibleCount) {
                currentIndex = originalCount + visibleCount - 1; // 마지막 아이템 위치? No.
                // originalCount가 6개, visible 3개면
                // clones(3) + originals(6) + clones(3) = 12 items.
                // index 0,1,2 (front clones). index 3 (real 1st).
                // If current index becomes 2 (clone of last item), we want to jump to...
                // real last item is at index: 3 + 6 - 1 = 8.
                // Wait, precise logic:
                // We are at index < 3. e.g. 2. We want to go to index 2 + 6 = 8.
                currentIndex = currentIndex + originalCount;
                updatePosition(false);
            }
        });
    }

    // ------------------------------------
    // 3. Upcoming 섹션 적용
    // ------------------------------------
    // 카드 너비 495px, 갭 40px, 화면에 약 3개 보임
    setupInfiniteCarousel('.upcoming_track', '.btn_prev_upcoming', '.btn_next_upcoming', '.upcoming_card', 3, 40);

    // ------------------------------------
    // 4. Story 섹션 적용
    // ------------------------------------
    // 카드 너비 395px, 갭 40px, 화면에 4개 보임 (1700 / 4 approx)
    setupInfiniteCarousel('.story_track', '.btn_prev_story', '.btn_next_story', '.story_item', 4, 40);

});