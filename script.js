document.getElementById('questionForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const questionInput = document.getElementById('questionInput');
    const questionText = questionInput.value;

    if (questionText) {
        const questionsList = document.getElementById('questionsList');
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question', 'border', 'rounded', 'p-3');
        questionDiv.textContent = questionText;

        try {
            // Firestore에 질문 저장
            const questionRef = await db.collection('questions').add({
                question: questionText,
                answers: []
            });

            const questionId = questionRef.id; // 질문 ID 가져오기

            // 답변 추가 버튼
            const answerButton = document.createElement('button');
            answerButton.textContent = '답변하기';
            answerButton.classList.add('btn', 'btn-secondary', 'ml-2');
            questionDiv.appendChild(answerButton);

            // 답변 입력 필드
            const answerInput = document.createElement('input');
            answerInput.type = 'text';
            answerInput.placeholder = '답변을 입력하세요';
            answerInput.classList.add('form-control', 'mt-2');
            answerInput.style.display = 'none'; // 처음에는 숨김
            questionDiv.appendChild(answerInput);

            // 답변 추가 기능
            answerButton.addEventListener('click', function() {
                answerInput.style.display = answerInput.style.display === 'none' ? 'block' : 'none';
                answerButton.textContent = answerButton.textContent === '답변하기' ? '답변 취소' : '답변하기';
            });

            answerInput.addEventListener('keypress', async function(event) {
                if (event.key === 'Enter' && answerInput.value) {
                    const answerDiv = document.createElement('div');
                    answerDiv.classList.add('answer');
                    answerDiv.textContent = answerInput.value;
                    questionDiv.appendChild(answerDiv);
                    
                    // Firestore에 답변 저장
                    await questionRef.update({
                        answers: firebase.firestore.FieldValue.arrayUnion(answerInput.value)
                    });

                    // SweetAlert2 알림
                    Swal.fire({
                        icon: 'success',
                        title: '답변이 등록되었습니다!',
                        text: '답변이 성공적으로 추가되었습니다.',
                    });

                    answerInput.value = '';
                    answerInput.style.display = 'none';
                    answerButton.textContent = '답변하기';
                }
            });

            questionsList.appendChild(questionDiv);
            questionInput.value = '';
        } catch (error) {
            console.error("질문 저장 중 오류 발생:", error);
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: '질문을 저장하는 중 오류가 발생했습니다.',
            });
        }
    }
});
