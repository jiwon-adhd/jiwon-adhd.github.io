document.addEventListener('DOMContentLoaded', () => {
    // 요소 선택
    const cursorFollower = document.querySelector('.cursor-follower');
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');
    const contactForm = document.getElementById('contact-form');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const sections = document.querySelectorAll('.section');
    const heroContent = document.querySelector('.hero-content');
    const darkModeToggle = document.getElementById('dark-mode-checkbox');

    // 페이지 로드 시 항상 다크모드 적용
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');

    // 페이지 로드 시 히어로 섹션 애니메이션 즉시 시작
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('animated');
        }, 300);
    }

    // 모든 이미지에 로딩 클래스 추가
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });

    // 모든 섹션에 초기 애니메이션 적용
    setTimeout(() => {
        sections[0].classList.add('in-view');
    }, 100);

    // 커스텀 커서 효과
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            
            // 커서 이동
            cursorFollower.style.transform = `translate(${x}px, ${y}px)`;
            
            if (cursorFollower.style.opacity === '0') {
                cursorFollower.style.opacity = '1';
            }
        });

        // 링크나 버튼 위에 커서가 있을 때 효과
        const interactiveElements = document.querySelectorAll('a, button, .listing-card, .tip-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorFollower.style.width = '50px';
                cursorFollower.style.height = '50px';
                cursorFollower.style.backgroundColor = 'rgba(158, 138, 120, 0.2)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursorFollower.style.width = '20px';
                cursorFollower.style.height = '20px';
                cursorFollower.style.backgroundColor = 'rgba(158, 138, 120, 0.3)';
            });
        });
    }

    // 스크롤 효과
    window.addEventListener('scroll', () => {
        // 헤더 스타일 변경
        if (window.scrollY > 50) {
            header.style.padding = '0.8rem 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.padding = '1.2rem 0';
            header.style.boxShadow = 'none';
        }
        
        // 섹션 애니메이션
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight * 0.8) {
                section.classList.add('in-view');
            }
        });
    });
    
    // 카드 애니메이션 적용
    const animateCards = () => {
        const cards = document.querySelectorAll('.listing-card, .tip-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, 200);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => {
            observer.observe(card);
        });
    };

    animateCards();
    
    // 모바일 메뉴 토글 개선
    if (menuToggle) {
        const navLinksContainer = document.querySelector('.nav-links');
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
            navLinksContainer.classList.toggle('active');
            
            // 메뉴가 열려 있을 때 스크롤 방지
            if (navLinksContainer.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // 메뉴 링크 클릭 시 모바일 메뉴 닫기
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
                navLinksContainer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 스크롤 최적화
    const supportsPassive = () => {
        let passive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function() { passive = true; return passive; }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        } catch (e) {}
        return passive;
    };
    
    // 터치 이벤트에 passive 속성 추가하여 스크롤 성능 향상
    document.addEventListener('touchstart', function() {}, supportsPassive() ? { passive: true } : false);
    document.addEventListener('touchmove', function() {}, supportsPassive() ? { passive: true } : false);
    
    // 이미지 슬라이더 (리스팅)
    if (prevBtn && nextBtn) {
        const listingsSlider = document.querySelector('.listings-slider');
        const listings = document.querySelectorAll('.listing-card');
        
        if (listings.length > 0) {
            let currentIndex = 0;
            const visibleListings = window.innerWidth > 1200 ? 3 : window.innerWidth > 768 ? 2 : 1;
            
            // 다음 버튼 클릭 이벤트
            nextBtn.addEventListener('click', () => {
                if (currentIndex < listings.length - visibleListings) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSlider();
            });
            
            // 이전 버튼 클릭 이벤트
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = listings.length - visibleListings;
                }
                updateSlider();
            });
            
            // 슬라이더 업데이트 함수
            function updateSlider() {
                const slideWidth = listings[0].offsetWidth + parseInt(getComputedStyle(listings[0]).marginRight);
                listingsSlider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
                listingsSlider.style.transition = 'transform 0.5s ease';
            }
            
            // 반응형 처리
            window.addEventListener('resize', () => {
                // 화면 크기에 따라 현재 인덱스 재설정
                const newVisibleListings = window.innerWidth > 1200 ? 3 : window.innerWidth > 768 ? 2 : 1;
                if (currentIndex > listings.length - newVisibleListings) {
                    currentIndex = listings.length - newVisibleListings;
                }
                updateSlider();
            });

            // 자동 슬라이더 기능 추가
            let slideInterval;
            
            // 자동 슬라이더 시작 함수
            function startSlider() {
                slideInterval = setInterval(() => {
                    if (currentIndex < listings.length - visibleListings) {
                        currentIndex++;
                    } else {
                        currentIndex = 0;
                    }
                    updateSlider();
                }, 5000); // 5초마다 슬라이드 변경
            }
            
            // 자동 슬라이더 정지 함수
            function stopSlider() {
                clearInterval(slideInterval);
            }
            
            // 마우스가 슬라이더 위에 있을 때 정지
            listingsSlider.addEventListener('mouseenter', stopSlider);
            
            // 마우스가 슬라이더에서 벗어났을 때 다시 시작
            listingsSlider.addEventListener('mouseleave', startSlider);
            
            // 페이지 로드 시 자동 슬라이더 시작
            startSlider();
        }
    }
    
    // 폼 제출 처리
    if (contactForm) {
        // 필드별 유효성 검사 함수
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        function validatePhone(phone) {
            // 한국 전화번호 형식 (XXX-XXXX-XXXX 또는 XXX-XXX-XXXX)
            const re = /^(\d{3})-?(\d{3,4})-?(\d{4})$/;
            return re.test(phone);
        }
        
        // 오류 메시지 표시 함수
        function showError(input, message) {
            const formGroup = input.parentElement;
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = 'var(--error)';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '5px';
            
            // 기존 오류 메시지 제거
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                formGroup.removeChild(existingError);
            }
            
            formGroup.appendChild(errorDiv);
            input.style.borderColor = 'var(--error)';
        }
        
        // 오류 메시지 제거 함수
        function clearError(input) {
            const formGroup = input.parentElement;
            const errorDiv = formGroup.querySelector('.error-message');
            if (errorDiv) {
                formGroup.removeChild(errorDiv);
            }
            input.style.borderColor = '';
        }
        
        // 폼 제출 처리
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 폼 데이터 가져오기
            const firstName = document.getElementById('first-name');
            const lastName = document.getElementById('last-name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const message = document.getElementById('message');
            
            // 유효성 검사 플래그
            let isValid = true;
            
            // 모든 필드 초기화
            [firstName, lastName, email, phone, message].forEach(input => {
                clearError(input);
            });
            
            // 필수 필드 검사
            if (!firstName.value.trim()) {
                showError(firstName, '이름을 입력해주세요');
                isValid = false;
            }
            
            if (!lastName.value.trim()) {
                showError(lastName, '성을 입력해주세요');
                isValid = false;
            }
            
            if (!email.value.trim()) {
                showError(email, '이메일을 입력해주세요');
                isValid = false;
            } else if (!validateEmail(email.value)) {
                showError(email, '유효한 이메일 주소를 입력해주세요');
                isValid = false;
            }
            
            if (!phone.value.trim()) {
                showError(phone, '전화번호를 입력해주세요');
                isValid = false;
            } else if (!validatePhone(phone.value)) {
                showError(phone, '유효한 전화번호 형식을 입력해주세요 (예: 010-1234-5678)');
                isValid = false;
            }
            
            if (!message.value.trim()) {
                showError(message, '메시지를 입력해주세요');
                isValid = false;
            }
            
            // 유효성 검사 통과 시 폼 제출
            if (isValid) {
                // 폼 제출 버튼 상태 변경
                const submitButton = contactForm.querySelector('.submit-button');
                submitButton.textContent = '전송 중...';
                submitButton.disabled = true;
                
                // 실제 서비스에서는 여기서 서버로 데이터를 전송
                // 데모를 위한 시뮬레이션
                setTimeout(() => {
                    submitButton.textContent = '전송 완료';
                    submitButton.style.backgroundColor = '#4caf50';
                    
                    // 폼 초기화
                    contactForm.reset();
                    
                    // 원래 상태로 돌아가기
                    setTimeout(() => {
                        submitButton.textContent = 'Submit';
                        submitButton.disabled = false;
                        submitButton.style.backgroundColor = '';
                    }, 2000);
                }, 1500);
            }
        });
        
        // 입력 필드에 입력하면 라벨 위로 애니메이션
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            // 초기 상태 확인
            if (input.value) {
                input.classList.add('has-value');
            }
            
            // 입력 이벤트
            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    }

    // 모바일에서 하단에서 올라오는 애니메이션
    if (window.innerWidth <= 768) {
        const animateMobileElements = () => {
            const elements = document.querySelectorAll('.section-header, .partner-content, .expert-grid, .contact-layout');
            
            elements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }, index * 100);
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.1
                });
                
                observer.observe(element);
            });
        };
        
        animateMobileElements();
    }

    // 필터 기능 구현
    const filterBtn = document.getElementById('filter-btn');
    const propertyTypeSelect = document.getElementById('property-type');
    const priceRangeSelect = document.getElementById('price-range');

    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            const propertyType = propertyTypeSelect.value;
            const priceRange = priceRangeSelect.value;
            
            // 모든 리스팅 카드 선택
            const listingCards = document.querySelectorAll('.listing-card');
            
            listingCards.forEach(card => {
                // 실제 프로젝트에서는 데이터 속성을 사용하여 필터링할 수 있습니다
                // 예시: <div class="listing-card" data-type="apartment" data-price="850">
                const cardType = card.getAttribute('data-type');
                const cardPrice = parseInt(card.getAttribute('data-price'));
                
                let typeMatch = propertyType === 'all' || cardType === propertyType;
                let priceMatch = true;
                
                if (priceRange === '0-500' && cardPrice > 500) {
                    priceMatch = false;
                } else if (priceRange === '500-1000' && (cardPrice < 500 || cardPrice > 1000)) {
                    priceMatch = false;
                } else if (priceRange === '1000+' && cardPrice < 1000) {
                    priceMatch = false;
                }
                
                if (typeMatch && priceMatch) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 모달 창 기능 (script.js에 추가)
    const modal = document.getElementById('property-modal');
    const closeModal = document.querySelector('.close-modal');
    const listingCards = document.querySelectorAll('.listing-card');

    // 부동산 데이터 (실제 프로젝트에서는 API나 데이터베이스에서 가져옴)
    const propertyData = [
        {
            id: 1,
            title: 'Modern Urban Apartment',
            location: '서울특별시 강남구',
            price: '₩890,000,000',
            description: '강남구에 위치한 현대적인 디자인의 아파트입니다. 넓은 거실과 3개의 침실, 2개의 욕실을 갖추고 있으며, 최신 시설이 완비되어 있습니다. 지하철 역에서 도보 5분 거리에 위치하여 교통이 매우 편리합니다.',
            features: {
                beds: 3,
                baths: 2,
                area: '180 m²',
                yearBuilt: 2020,
                parking: 2,
                heating: '중앙난방'
            },
            images: [
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            ],
            agent: {
                name: '김태호',
                phone: '010-1234-5678',
                email: 'kim@property.com',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
            }
        },
        // 더 많은 부동산 데이터 추가 가능
    ];

    // 각 리스팅 카드에 클릭 이벤트 추가
    listingCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // 실제 프로젝트에서는 카드의 데이터 속성에서 ID를 가져옴
            const propertyId = index + 1;
            openPropertyModal(propertyId);
        });
    });

    // 모달 닫기
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // 부동산 모달 열기 함수
    function openPropertyModal(propertyId) {
        // 데이터 찾기 (실제 프로젝트에서는 API 호출)
        const property = propertyData.find(p => p.id === propertyId) || propertyData[0];
        
        // 모달 내용 채우기
        const modalContent = document.getElementById('modal-content-container');
        
        modalContent.innerHTML = `
            <div class="property-gallery">
                <div class="main-image">
                    <img src="${property.images[0]}" alt="${property.title}" id="main-property-image">
                </div>
                <div class="thumbnail-container">
                    ${property.images.slice(0, 3).map((img, i) => `
                        <div class="thumbnail" data-index="${i}">
                            <img src="${img}" alt="Property Image ${i+1}">
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="property-details">
                <div class="property-info">
                    <h2>${property.title}</h2>
                    <p class="location">${property.location}</p>
                    <p class="property-price">${property.price}</p>
                    <div class="property-description">
                        ${property.description}
                    </div>
                    <h3>특징</h3>
                    <div class="property-features">
                        <div class="feature-item">
                            <span>침실</span>
                            <strong>${property.features.beds}</strong>
                        </div>
                        <div class="feature-item">
                            <span>욕실</span>
                            <strong>${property.features.baths}</strong>
                        </div>
                        <div class="feature-item">
                            <span>면적</span>
                            <strong>${property.features.area}</strong>
                        </div>
                        <div class="feature-item">
                            <span>건축년도</span>
                            <strong>${property.features.yearBuilt}</strong>
                        </div>
                        <div class="feature-item">
                            <span>주차</span>
                            <strong>${property.features.parking} 대</strong>
                        </div>
                        <div class="feature-item">
                            <span>난방</span>
                            <strong>${property.features.heating}</strong>
                        </div>
                    </div>
                    <button class="cta-button">방문 예약하기</button>
                </div>
                <div class="agent-info-container">
                    <div class="agent-card">
                        <h3>담당 에이전트</h3>
                        <div class="agent-info">
                            <div class="agent-avatar">
                                <img src="${property.agent.image}" alt="${property.agent.name}">
                            </div>
                            <div>
                                <h4>${property.agent.name}</h4>
                                <p>부동산 전문가</p>
                            </div>
                        </div>
                        <div class="agent-contact">
                            <a href="tel:${property.agent.phone}">
                                <span>📞</span> ${property.agent.phone}
                            </a>
                            <a href="mailto:${property.agent.email}">
                                <span>✉️</span> ${property.agent.email}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 썸네일 클릭 이벤트 추가
        const thumbnails = modalContent.querySelectorAll('.thumbnail');
        const mainImage = modalContent.querySelector('#main-property-image');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.getAttribute('data-index'));
                mainImage.src = property.images[index];
                mainImage.alt = `Property Image ${index+1}`;
            });
        });
        
        // 모달 표시
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // 프로젝트 데이터 - 더 자세한 정보 포함
    const projectsData = [
        {
            id: 'project1',
            title: '모던 미니멀리즘 주택',
            location: '주거용 건축 프로젝트',
            description: '자연 친화적인 소재와 모던한 라인이 조화로운 미니멀리즘 주택 디자인. 자연광을 최대한 활용한 에너지 효율적인 설계가 특징입니다. 공간의 효율성과 심리적 효과를 모두 고려한 인테리어는 거주자의 일상에 평온함을 더합니다.',
            detailedDescription: '이 프로젝트는 현대 도시 생활의 복잡함에서 벗어나 심리적 안정감을 제공하는 주거 공간을 목표로 했습니다. 신경건축학적 원리를 적용하여 자연광의 유입 경로와 내부 공간의 비율을 설계했으며, 이는 거주자의 일상적 스트레스를 감소시키는 효과가 있습니다.<br><br>1층 생활 공간은 개방감과 연결성을 강조하면서도, 각 영역이 시각적으로 구분되도록 설계했습니다. 천장 높이의 변화와 간접 조명을 활용하여 공간의 깊이감을 더했으며, 대형 창을 통한 자연과의 연결은 거주자의 웰빙에 중요한 역할을 합니다.<br><br>에너지 효율성을 위해 패시브 디자인 원칙을 따랐으며, 단열재와 이중 유리창을 사용하여 에너지 소비를 최소화했습니다.',
            features: ['콘셉트 디자인', '3D 모델링', '실내 디자인'],
            year: '2023',
            size: '210㎡',
            client: '개인 거주자',
            images: [
                'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600566753376-12c8ab8bdea2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            materials: [
                {
                    name: '자연석 벽면',
                    description: '지역에서 채취한 자연석을 활용한 벽면 처리로, 공간에 따뜻함과 자연적 질감을 더합니다.',
                    image: 'https://images.unsplash.com/photo-1620641622500-7692e7da3415?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: '화이트 오크 바닥재',
                    description: '지속 가능한 방식으로 수확된 화이트 오크 목재를 사용한 바닥은 공간에 따뜻함과 밝은 분위기를 제공합니다.',
                    image: 'https://images.unsplash.com/photo-1622126718991-49e01bfb8122?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: '맞춤형 조명 시스템',
                    description: '신경건축학적 원리에 기반한 간접 조명 시스템으로, 거주자의 서커디안 리듬에 맞춰 빛의 색온도가 자동 조절됩니다.',
                    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: '친환경 단열재',
                    description: '재활용 재료로 만든 고효율 단열재를 사용하여 에너지 효율성을 높이고 지속 가능한 건축을 실현했습니다.',
                    image: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                }
            ],
            feedback: [
                {
                    author: '김지훈',
                    rating: 5,
                    text: '공간의 흐름과 빛의 활용이 정말 훌륭합니다. 특히 자연 소재의 질감이 느껴지는 벽면 처리가 인상적이었어요.',
                    date: '2023년 11월 15일'
                },
                {
                    author: '이서연',
                    rating: 4,
                    text: '미니멀하면서도 따뜻한 느낌의 공간이 마음에 들었습니다. 자연광 활용 방식이 특히 인상적입니다.',
                    date: '2023년 10월 3일'
                }
            ]
        },
        {
            id: 'project2',
            title: '도심 복합 문화 공간',
            location: '상업용 건축 프로젝트',
            description: '도심 속 문화와 상업이 공존하는 복합 공간 디자인. 대중과 소통하는 열린 구조와 지속 가능한 건축 요소를 적용했습니다.',
            detailedDescription: '이 프로젝트는 도심 속에서 문화와 상업 활동이 자연스럽게 어우러질 수 있는 복합 공간을 목표로 했습니다. 옛 창고 건물을 리노베이션하여 역사적 맥락을 유지하면서도 현대적 기능을 갖춘 공간으로 재탄생시켰습니다.<br><br>1층은 카페와 소규모 상점들이 들어서는 상업 공간으로, 2층과 3층은 전시와 공연이 가능한 문화 공간으로 설계했습니다. 각 층은 독립적으로 기능하면서도 중앙 아트리움을 통해 시각적으로 연결되어 있어, 방문객들이 다양한 경험을 연속적으로 즐길 수 있습니다.<br><br>기존 건물의 콘크리트 구조와 철골 프레임을 노출시켜 산업적 미학을 살렸으며, 신경건축학적 원리를 적용하여 방문객들의 움직임과 시선을 자연스럽게 유도하는 공간 구성을 통해 사용자 경험을 향상시켰습니다.',
            features: ['마스터플랜', '파사드 디자인', '공간 계획'],
            year: '2022',
            size: '1,200㎡',
            client: '도시재생기업',
            images: [
                'https://images.unsplash.com/photo-1470723710355-95304d8aece4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1481277542470-605612bd2d61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            materials: [
                {
                    name: '노출 콘크리트',
                    description: '기존 건물의 콘크리트 구조를 보존하고 노출시켜 산업적 미학을 강조하고 역사적 맥락을 유지했습니다.',
                    image: 'https://images.unsplash.com/photo-1560748526-881455a4e6b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: '유리 파티션',
                    description: '공간 구분을 위한 대형 유리 파티션은 시각적 연결성을 유지하면서 소음을 효과적으로 차단합니다.',
                    image: 'https://images.unsplash.com/photo-1600607688066-890987f18a86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: '재활용 목재 패널',
                    description: '지역 내 헌 건물에서 수거한 목재를 재가공하여 벽면 패널로 활용, 지속 가능성과 따뜻한 질감을 더했습니다.',
                    image: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: '맞춤형 조명 레일',
                    description: '전시 공간의 유연성을 위해 개발된 맞춤형 조명 레일 시스템으로, 다양한 전시와 이벤트에 적응할 수 있습니다.',
                    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                }
            ],
            feedback: [
                {
                    author: '박민준',
                    rating: 5,
                    text: '오래된 창고가 이렇게 멋진 공간으로 변신할 수 있다니 놀랍습니다. 특히 중앙 아트리움을 통한 층간 연결이 인상적이에요.',
                    date: '2023년 9월 25일'
                },
                {
                    author: '최지원',
                    rating: 5,
                    text: '공간의 유연성이 정말 좋습니다. 전시와 공연, 그리고 상업 공간이 자연스럽게 어우러져 있어요.',
                    date: '2023년 8월 17일'
                }
            ]
        },
        {
            id: 'project3',
            title: '현대 미술관 리노베이션',
            location: '공공 건축 프로젝트',
            description: '역사적 건물의 가치를 보존하면서 현대적 기능을 더한 미술관 리노베이션 프로젝트. 과거와 현재가 공존하는 공간을 구현했습니다.',
            detailedDescription: '1930년대에 지어진 역사적 건물을 현대 미술관으로 리노베이션한 이 프로젝트는 건축의 역사적 가치를 보존하면서 현대적 필요를 충족시키는 것을 목표로 했습니다. 신경건축학적 원리를 적용하여 방문객의 동선과 전시 경험을 최적화했습니다.<br><br>기존 건물의 외관과 주요 구조는 보존하되, 내부는 유연한 전시 공간으로 재구성했습니다. 천장의 높이를 활용한 수직적 전시 공간과 자연광을 효과적으로 제어하는 시스템을 도입하여 다양한 예술 작품을 최적의 환경에서 전시할 수 있도록 했습니다.<br><br>지속 가능성을 고려한 재료 선택과 에너지 효율적인 시스템 도입으로 환경적 영향을 최소화했으며, 접근성을 높이기 위한 디자인 요소들을 통합하여 모든 방문객이 예술을 경험할 수 있는 포용적인 공간을 만들었습니다.',
            features: ['리노베이션', '전시 공간', '조명 디자인'],
            year: '2021',
            size: '2,500㎡',
            client: '시립 문화재단',
            images: [
                'https://images.unsplash.com/photo-1464146072230-91cabc968266?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1574857089251-5080e5d6150e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1586779161268-83ea5f7256e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1581359424554-f591b2afccc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            materials: [
                {
                    name: '맞춤형 확산 유리',
                    description: '전시 공간의 자연광 조절을 위해 개발된 특수 확산 유리로, 작품 보존에 이상적인 빛 환경을 제공합니다.',
                    image: 'https://images.unsplash.com/photo-1550173551-e55dea942aad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: '음향 패널',
                    description: '공간의 음향을 최적화하기 위한 맞춤형 음향 패널로, 전시와 공연을 모두 수용할 수 있는 환경을 제공합니다.',
                    image: 'https://images.unsplash.com/photo-1570034553545-9a39f3fa4447?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: '테라조 바닥재',
                    description: '원래 건물의 바닥재를 복원하고 현대적으로 재해석한 테라조 마감으로, 내구성과 역사적 맥락을 모두 고려했습니다.',
                    image: 'https://images.unsplash.com/photo-1583383923755-e049be586edd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: '모듈식 전시 시스템',
                    description: '다양한 전시 형태에 맞춰 변형 가능한 모듈식 벽체와 디스플레이 시스템으로, 공간의 유연성을 극대화했습니다.',
                    image: 'https://images.unsplash.com/photo-1621275471769-e6aa344546d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                }
            ],
            feedback: [
                {
                    author: '정수현',
                    rating: 5,
                    text: '역사적 건물의 특성을 살리면서도 현대적 기능을 완벽하게 구현한 공간입니다. 특히 빛의 조절이 정말 섬세해요.',
                    date: '2023년 7월 12일'
                },
                {
                    author: '윤도현',
                    rating: 4,
                    text: '예술 작품을 감상하기에 최적화된 공간 설계가 인상적입니다. 동선도 매우 자연스럽게 흘러요.',
                    date: '2023년 6월 5일'
                }
            ]
        }
    ];

    // 프로젝트 상세 페이지 모달 관련 요소
    const projectDetailModal = document.getElementById('project-detail-modal');
    const projectDetailContainer = document.getElementById('project-detail-container');
    const closeModalBtn = document.querySelector('.close-modal');
    const viewDetailsButtons = document.querySelectorAll('.view-details');

    // 프로젝트 상세 페이지 열기
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project');
            openProjectModal(projectId);
        });
    });

    // 모달 닫기
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            projectDetailModal.classList.remove('active');
            setTimeout(() => {
                projectDetailModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        });
    }

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === projectDetailModal) {
            projectDetailModal.classList.remove('active');
            setTimeout(() => {
                projectDetailModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectDetailModal.classList.contains('active')) {
            projectDetailModal.classList.remove('active');
            setTimeout(() => {
                projectDetailModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    });

    // 프로젝트 모달 열기 함수
    function openProjectModal(projectId) {
        // 프로젝트 데이터 찾기
        const project = projectsData.find(p => p.id === projectId);
        
        if (!project) return;
        
        // 모달 내용 채우기
        projectDetailContainer.innerHTML = `
            <div class="project-detail-header">
                <h2>${project.title}</h2>
                <p>${project.location}</p>
            </div>
            
            <div class="project-gallery">
                <div class="gallery-item main-image">
                    <img src="${project.images[0]}" alt="${project.title}">
                </div>
                ${project.images.slice(1).map(img => `
                    <div class="gallery-item">
                        <img src="${img}" alt="${project.title}">
                    </div>
                `).join('')}
            </div>
            
            <div class="project-info">
                <div class="project-description-full">
                    ${project.detailedDescription}
                </div>
                
                <div class="project-specs">
                    <div class="spec-item">
                        <strong>년도:</strong> ${project.year}
                    </div>
                    <div class="spec-item">
                        <strong>면적:</strong> ${project.size}
                    </div>
                    <div class="spec-item">
                        <strong>클라이언트:</strong> ${project.client}
                    </div>
                    <div class="spec-item">
                        <strong>특징:</strong> ${project.features.join(', ')}
                    </div>
                </div>
            </div>
            
            <!-- 재료 및 디테일 섹션 -->
            <div class="materials-section">
                <h3 class="materials-title">사용된 재료 및 디테일</h3>
                <div class="materials-grid">
                    ${project.materials.map(material => `
                        <div class="material-card">
                            <div class="material-image">
                                <img src="${material.image}" alt="${material.name}">
                            </div>
                            <div class="material-details">
                                <h4>${material.name}</h4>
                                <p>${material.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 방문자 피드백 섹션 -->
            <div class="feedback-section">
                <h3 class="feedback-title">방문자 피드백</h3>
                
                <div class="feedback-form">
                    <div class="rating-stars">
                        <span class="star" data-rating="1">★</span>
                        <span class="star" data-rating="2">★</span>
                        <span class="star" data-rating="3">★</span>
                        <span class="star" data-rating="4">★</span>
                        <span class="star" data-rating="5">★</span>
                    </div>
                    <textarea class="feedback-input" placeholder="이 프로젝트에 대한 의견을 남겨주세요..."></textarea>
                    <button class="feedback-submit">피드백 제출</button>
                </div>
                
                <div class="existing-feedback">
                    ${project.feedback.map(feedback => `
                        <div class="feedback-card">
                            <div class="feedback-header">
                                <span class="feedback-author">${feedback.author}</span>
                                <span class="feedback-rating">${'★'.repeat(feedback.rating)}</span>
                            </div>
                            <p class="feedback-text">${feedback.text}</p>
                            <p class="feedback-date">${feedback.date}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // 별점 기능 활성화
        const stars = projectDetailContainer.querySelectorAll('.star');
        let selectedRating = 0;
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                selectedRating = rating;
                
                // 별점 시각적 업데이트
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-rating')) <= rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
            
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-rating')) <= rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
            
            star.addEventListener('mouseout', function() {
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-rating')) <= selectedRating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
        
        // 피드백 제출 버튼
        const feedbackSubmitBtn = projectDetailContainer.querySelector('.feedback-submit');
        const feedbackInput = projectDetailContainer.querySelector('.feedback-input');
        
        feedbackSubmitBtn.addEventListener('click', function() {
            if (selectedRating === 0) {
                alert('별점을 선택해주세요.');
                return;
            }
            
            if (feedbackInput.value.trim() === '') {
                alert('피드백 내용을 입력해주세요.');
                return;
            }
            
            // 실제 프로젝트에서는 서버로 데이터 전송
            alert('피드백이 제출되었습니다. 감사합니다!');
            
            // 피드백 추가 (예시)
            const existingFeedback = projectDetailContainer.querySelector('.existing-feedback');
            const newFeedback = document.createElement('div');
            newFeedback.className = 'feedback-card';
            newFeedback.innerHTML = `
                <div class="feedback-header">
                    <span class="feedback-author">방문자</span>
                    <span class="feedback-rating">${'★'.repeat(selectedRating)}</span>
                </div>
                <p class="feedback-text">${feedbackInput.value}</p>
                <p class="feedback-date">${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            `;
            
            existingFeedback.prepend(newFeedback);
            
            // 입력 필드 초기화
            selectedRating = 0;
            feedbackInput.value = '';
            stars.forEach(s => s.classList.remove('active'));
        });
        
        // 모달 표시
        projectDetailModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 애니메이션 효과
        setTimeout(() => {
            projectDetailModal.classList.add('active');
        }, 10);
    }
});
