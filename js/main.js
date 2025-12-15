// main.js 파일 (기존 코드 전체 삭제 후 아래로 대체)

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // 🖼️ Today 섹션 호버 텍스트/오버레이 기능만 유지
    // ------------------------------------
    const postContainer = document.querySelector('.post_container');
    const postItems = document.querySelectorAll('.post_item');

    if (postContainer && postItems.length > 0) {
        // 호버 시 확대/축소 기능은 복잡한 절대 위치 레이아웃에서 구현하기 어려워 제외합니다.
        // CSS 호버 효과(어두워짐, 텍스트 표시)만 사용합니다. 
    }
});