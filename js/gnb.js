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

    const header = document.querySelector('.header');
    let lastY = window.scrollY;
    const delta = 5; // 민감도(너무 깜빡이면 10으로 올려)

    window.addEventListener('scroll', () => {
        if (!header) return;

        // 전체 메뉴 열려있을 땐 헤더 숨김/보임 제어 안 함(선택)
        if (allMenuWrap && allMenuWrap.classList.contains('is_active')) return;

        const y = window.scrollY;

        // 맨 위에서는 항상 보이기
        if (y <= 0) {
            header.classList.remove('is_hidden');
            lastY = y;
            return;
        }

        // 아래로 스크롤하면 숨김
        if (y > lastY + delta) header.classList.add('is_hidden');

        // 위로 스크롤하면 보임
        if (y < lastY - delta) header.classList.remove('is_hidden');

        lastY = y;
    });
});