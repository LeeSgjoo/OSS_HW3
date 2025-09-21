window.onload = function() {
  const tableBody = document.getElementById('friendTableBody');
  let friends = JSON.parse(localStorage.getItem('friends')) || [];

  if (friends.length === 0) {
    const initialFriends = [
      { id: 1, name: '홍길동', age: 25, phone: '010-1234-5678', birthday: '1995-01-20', relationship: '고향 친구', degree: 4, tmi: '치킨을 좋아함', addedDate: '2023-09-01' },
      { id: 2, name: '김철수', age: 27, phone: '010-9876-5432', birthday: '1998-05-15', relationship: '초등학교 동창', degree: 5, tmi: '매일 헬스함', addedDate: '2023-09-02' },
      { id: 3, name: '이영희', age: 26, phone: '010-5555-4444', birthday: '1996-11-28', relationship: '대학 선배', degree: 3, tmi: '매주 등산', addedDate: '2023-09-03' }
    ];
    localStorage.setItem('friends', JSON.stringify(initialFriends));
    friends = initialFriends;
  }

  function renderFriends() {
    tableBody.innerHTML = '';
    friends.forEach((friend, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td><a href="view.html?id=${friend.id}">${friend.name}</a></td>
        <td>${friend.relationship}</td>
        <td>${friend.degree}점</td>
        <td>
          <a href="edit.html?id=${friend.id}" class="btn btn-sm btn-info me-2">[수정]</a>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${friend.id}">[삭제]</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const friendId = parseInt(e.target.dataset.id);
        if (confirm("게시물을 삭제할까요?")) {
          friends = friends.filter(f => f.id !== friendId);
          localStorage.setItem('friends', JSON.stringify(friends));
          renderFriends();
        }
      });
    });
  }
  renderFriends();
};