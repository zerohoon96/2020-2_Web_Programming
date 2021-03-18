async function getData(){
  try {
    const res = await axios.get('/board/contents');
    const contents = res.data;
    const tbody = document.querySelector('#post-list tbody');
    tbody.innerHTML = '';
    contents.map(function (content) {
      //행 추가
      const row = document.createElement('tr');

      //데이터 셀 생성 후 행에 추가
      let td = document.createElement('td');
      td.textContent = content.title;
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = content.commenter.nick;
      row.appendChild(td);
      td = document.createElement('td');
      let split_date=content.createdAt.split("T");
      td.textContent = split_date[0];
      row.appendChild(td);
      //버튼 셀 생성
      const read = document.createElement('button');
      read.textContent = '읽기';
      read.addEventListener('click', async () => { // 읽기 클릭 시
        alert(content.content);
      });

      const edit = document.createElement('button');
      edit.textContent = '수정';
      edit.addEventListener('click', async () => { // 수정 클릭 시
        const newContent = prompt('수정할 내용을 입력하세요');
        if (!newContent) {
          return alert('내용을 입력하지 않았습니다.');
        }
        try {
          const res = await axios.patch(`/board/${content._id}`, { content: newContent, commenter : content.commenter });
          if(!res.data.success){
            alert('작성자만 수정이 가능합니다.');
          }
          else{ //정상 수정 후 새로고침
            history.go(0);
          }
        } catch (err) {
          console.error(err);
        }
      });

      const remove = document.createElement('button');
      remove.textContent = '삭제';
      remove.addEventListener('click', async () => { // 삭제 클릭 시
        try {
          const res = await axios.delete(`/board/${content._id}`,{ data:{commenter : content.commenter} });
          if(!res.data.success){
            alert('작성자만 삭제가 가능합니다.');
          }
          else{ //정상 삭제 후 새로고침
            history.go(0);
          }
        } catch (err) {
          console.error(err);
        }
      });

      //행에 버튼 셀 추가
      td = document.createElement('td');
      td.appendChild(read);
      row.appendChild(td);
      td = document.createElement('td');
      td.appendChild(edit);
      row.appendChild(td);
      td = document.createElement('td');
      td.appendChild(remove);
      row.appendChild(td);
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);        
  }
}
getData();