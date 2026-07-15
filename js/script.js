/* ============================================
   鹭衍盛 - 全局交互脚本
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // --- 移动端菜单切换 ---
    initMobileMenu();

    // --- 导航栏滚动效果 ---
    initNavbarScroll();

    // --- 导航高亮联动 ---
    initNavHighlight();

    // --- 滚动渐入动画 ---
    initFadeIn();

    // --- 表单验证 ---
    initFormValidation();

    // --- 案例筛选（子页面） ---
    initPropertyFilter();

});

/**
 * 移动端菜单切换
 */
function initMobileMenu() {
    var menuToggle = document.querySelector('.menu-toggle');
    var navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

/**
 * 导航栏滚动效果
 */
function initNavbarScroll() {
    var header = document.getElementById('siteHeader');
    var navMenu = document.querySelector('.nav-menu');
    var consultBtn = document.querySelector('.consult-btn');
    if (!header) return;

    window.addEventListener('scroll', function () {
        // 导航栏背景变化
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 首页：滚动超过 Hero 后隐藏导航链接，只显示汉堡菜单
        var heroSection = document.getElementById('top');
        if (heroSection && navMenu && consultBtn) {
            var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            if (window.scrollY > heroBottom - 100) {
                navMenu.classList.add('hidden-on-scroll');
                consultBtn.classList.add('hidden-on-scroll');
            } else {
                navMenu.classList.remove('hidden-on-scroll');
                consultBtn.classList.remove('hidden-on-scroll');
            }
        }
    });
}

/**
 * 滚动时高亮当前区块对应的导航链接
 */
function initNavHighlight() {
    var navLinks = document.querySelectorAll('.nav-menu a[data-nav]');
    if (!navLinks.length) return;

    var sections = [];
    navLinks.forEach(function (link) {
        var targetId = link.getAttribute('href').substring(1);
        var section = document.getElementById(targetId);
        if (section) sections.push({ el: section, link: link });
    });

    if (!sections.length) return;

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var targetId = entry.target.id;
                    navLinks.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('data-nav') === targetId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(function (item) {
        observer.observe(item.el);
    });
}

/**
 * 滚动渐入动画
 */
function initFadeIn() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    elements.forEach(function (el) {
        observer.observe(el);
    });
}

/**
 * 表单验证
 */
function initFormValidation() {
    var forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            var isValid = true;
            var requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(function (field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';

                    var existingMsg = field.parentElement.querySelector('.error-msg');
                    if (existingMsg) existingMsg.remove();

                    var errorMsg = document.createElement('span');
                    errorMsg.className = 'error-msg';
                    errorMsg.style.color = '#e74c3c';
                    errorMsg.style.fontSize = '0.8rem';
                    errorMsg.style.marginTop = '4px';
                    errorMsg.textContent = '此项为必填';
                    field.parentElement.appendChild(errorMsg);
                } else {
                    field.style.borderColor = '';
                    var existingMsg = field.parentElement.querySelector('.error-msg');
                    if (existingMsg) existingMsg.remove();
                }
            });

            var emailField = form.querySelector('input[type=\"email\"]');
            if (emailField && emailField.value.trim()) {
                var emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    alert('请输入有效的邮箱地址');
                }
            }

            if (!isValid) {
                e.preventDefault();
            } else {
                e.preventDefault();
                alert('感谢您的咨询！我们会尽快与您联系。');
                form.reset();
            }
        });
    });
}

/**
 * 案例筛选功能
 */
function initPropertyFilter() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var propertyCards = document.querySelectorAll('.property-card');

    if (!filterBtns.length || !propertyCards.length) return;

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            var filter = this.getAttribute('data-filter');

            propertyCards.forEach(function (card) {
                var category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.classList.remove('visible');
                    setTimeout(function () { card.classList.add('visible'); }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}
