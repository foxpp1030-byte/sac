document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // 1. 메인 비주얼 슬라이더 (무한 롤링)
    // ------------------------------------
    const sliderContainer = document.querySelector('.visual_container');
    const slides = document.querySelectorAll('.visual_item');
    const slideCount = slides.length; // HTML에 복제본 포함하여 4개

    if (sliderContainer && slideCount > 0) {
        let currentIndex = 0;
        const intervalTime = 5000; // 5초마다 이동

        function nextSlide() {
            if (currentIndex >= slideCount - 1) return;

            currentIndex++;

            sliderContainer.style.transition = 'transform 0.8s ease-in-out';
            const translateValue = -(currentIndex * 25);
            sliderContainer.style.transform = `translateX(${translateValue}%)`;

            // 마지막 슬라이드(복제된 1번) 도달 시 리셋
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
    // 2. Upcoming 섹션 슬라이더 (순환 로직)
    // ------------------------------------
    const upcomingTrack = document.querySelector('.upcoming_track');
    const btnPrev = document.querySelector('.btn_prev');
    const btnNext = document.querySelector('.btn_next');

    if (upcomingTrack && btnPrev && btnNext) {
        // 카드 너비(495) + 갭(40) = 535px
        const cardWidth = 495;
        const gap = 40;
        const moveAmount = cardWidth + gap;
        let currentIndex = 0;

        // 총 카드 개수
        const totalCards = upcomingTrack.children.length; // 6개
        // 화면에 보이는 카드 개수 (대략 3개)
        const visibleCards = 3;

        // 인덱스 범위: 0 ~ (totalCards - visibleCards)
        // 여기서는 Loop 기능을 위해 인덱스를 자유롭게 돌리고 위치를 계산

        // 함수: 특정 인덱스로 이동
        function moveToIndex(index) {
            currentIndex = index;
            const translateValue = -(currentIndex * moveAmount);
            upcomingTrack.style.transform = `translateX(${translateValue}px)`;
        }

        btnNext.addEventListener('click', () => {
            // 마지막 카드(전우치)인 경우 -> 처음으로
            // 현재 보이는 3개 기준, 마지막 인덱스는 totalCards - visibleCards
            if (currentIndex >= totalCards - visibleCards) {
                moveToIndex(0);
            } else {
                moveToIndex(currentIndex + 1);
            }
        });

        btnPrev.addEventListener('click', () => {
            // 첫 번째 카드인 경우 -> 마지막으로
            if (currentIndex <= 0) {
                moveToIndex(totalCards - visibleCards);
            } else {
                moveToIndex(currentIndex - 1);
            }
        });
    }
});