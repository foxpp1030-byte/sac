// main.js 파일 내용

document.addEventListener('DOMContentLoaded', () => {
    // 햄버거 버튼 (전체 메뉴 열기 버튼)
    const openMenuBtn = document.querySelector('.gnb_icon button[aria-label="전체 메뉴"]');
    // 전체 메뉴 닫기 버튼
    const closeMenuBtn = document.querySelector('.all_menu_close_btn');
    // 전체 메뉴 래퍼
    const allMenuWrap = document.querySelector('.all_menu_wrap');

    if (openMenuBtn && closeMenuBtn && allMenuWrap) {
        // 햄버거 버튼 클릭 시 메뉴 열기
        openMenuBtn.addEventListener('click', () => {
            allMenuWrap.classList.add('is_active');
            // 메뉴가 열리면 스크롤 방지 (선택 사항)
            document.body.style.overflow = 'hidden';
        });

        // 닫기 버튼 클릭 시 메뉴 닫기
        closeMenuBtn.addEventListener('click', () => {
            allMenuWrap.classList.remove('is_active');
            // 메뉴가 닫히면 스크롤 허용 (선택 사항)
            document.body.style.overflow = 'auto';
        });

        // 외부 영역 클릭 시 메뉴 닫기 (optional)
        allMenuWrap.addEventListener('click', (e) => {
            if (e.target === allMenuWrap) {
                allMenuWrap.classList.remove('is_active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});