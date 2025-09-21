window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPath = window.location.pathname;
  let friends = JSON.parse(localStorage.getItem('friends')) || [];

  function validateForm(formData) {
    if (!formData.name || formData.name.length < 3 || formData.name.length > 5) {
      alert("이름은 3~5자 이내여야 합니다.");
      return false;
    }
    if (isNaN(formData.age) || formData.age < 0) {
      alert("나이는 0 이상의 숫자여야 합니다.");
      return false;
    }
    if (!formData.phone || !/^\d{3}-\d{4}-\d{4}$/.test(formData.phone)) {
      alert("연락처는 000-0000-0000 형식으로 입력해주세요.");
      return false;
    }
    if (!formData.addedDate) {
      alert("추가 날짜를 입력해주세요.");
      return false;
    }
    return true;
  }

  if (currentPath.includes('add.html') || currentPath.includes('edit.html')) {
    const form = document.getElementById('friendForm');
    const friendId = urlParams.get('id');

    if (friendId) {
      const friendToEdit = friends.find(f => f.id == friendId);
      if (friendToEdit) {
        document.getElementById('name').value = friendToEdit.name;
        document.getElementById('age').value = friendToEdit.age;
        document.getElementById('phone').value = friendToEdit.phone;
        document.getElementById('birthday').value = friendToEdit.birthday;
        document.getElementById('relationship').value = friendToEdit.relationship;
        document.querySelector(`input[name="degree"][value="${friendToEdit.degree}"]`).checked = true;
        document.getElementById('tmi').value = friendToEdit.tmi;
        document.getElementById('addedDate').value = friendToEdit.addedDate;
      }
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        phone: document.getElementById('phone').value,
        birthday: document.getElementById('birthday').value,
        relationship: document.getElementById('relationship').value,
        degree: parseInt(document.querySelector('input[name="degree"]:checked').value),
        tmi: document.getElementById('tmi').value,
        addedDate: document.getElementById('addedDate').value
      };

      if (validateForm(formData)) {
        if (friendId) {
          if (confirm("게시물을 수정할까요?")) {
            const index = friends.findIndex(f => f.id == friendId);
            if (index !== -1) {
              friends[index] = { ...friends[index], ...formData };
              localStorage.setItem('friends', JSON.stringify(friends));
              window.location.href = `view.html?id=${friendId}`;
            }
          }
        } else {
          alert("게시물이 추가됩니다.");
          const newId = friends.length > 0 ? Math.max(...friends.map(f => f.id)) + 1 : 1;
          const newFriend = { ...formData, id: newId };
          friends.push(newFriend);
          localStorage.setItem('friends', JSON.stringify(friends));
          window.location.href = 'index.html';
        }
      }
    });
  }

  if (currentPath.includes('view.html')) {
    const friendId = urlParams.get('id');
    const friendInfoDiv = document.getElementById('friend-info');
    const friend = friends.find(f => f.id == friendId);

    if (friend) {
      friendInfoDiv.innerHTML = `
        <h3 class="mb-3">${friend.name}</h3>
        <p><strong>나이:</strong> ${friend.age}세</p>
        <p><strong>연락처:</strong> ${friend.phone}</p>
        <p><strong>생일:</strong> ${friend.birthday}</p>
        <p><strong>나와의 관계:</strong> ${friend.relationship}</p>
        <p><strong>친밀도:</strong> ${friend.degree}점</p>
        <p><strong>TMI:</strong> ${friend.tmi}</p>
        <p><strong>추가 날짜:</strong> ${friend.addedDate}</p>
      `;
      document.getElementById('editBtn').href = `edit.html?id=${friendId}`;
      document.getElementById('deleteBtn').addEventListener('click', () => {
        if (confirm("게시물을 삭제할까요?")) {
          friends = friends.filter(f => f.id != friendId);
          localStorage.setItem('friends', JSON.stringify(friends));
          window.location.href = 'index.html';
        }
      });
    } else {
      friendInfoDiv.innerHTML = `<p class="text-danger">친구 정보를 찾을 수 없습니다.</p>`;
    }
  }
};