
async function getData(){
  try {
    const res = await axios.get('/gallery/contents'); ////////////////////
    const contents = res.data;
    const tbody = document.querySelector('#gallery-list tbody'); 
    tbody.innerHTML = '';
    contents.map(function (content) {
      //행 추가
      const row = document.createElement('tr');
      
      //데이터 셀 생성 후 행에 추가
      let td = document.createElement('img');
      td.width=400;

      td.src = content.img; //사진
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = content.commenter.nick; //작성자
      row.appendChild(td);
      td = document.createElement('td');
      let split_date=content.createdAt.split("T"); //작성일
      td.textContent = split_date[0];
      row.appendChild(td);

      const edit = document.createElement('button');
      edit.textContent = '수정';
      edit.addEventListener('click', async () => { // 수정 클릭 시
        try {
          const res = await axios.patch(`/gallery/${content._id}`,{commenter : content.commenter });
          if(!res.data.success){
            alert('작성자만 수정이 가능합니다.');
          }
          else{ //정상 수정 후 새로고침
            update(content);
          }
        } catch (err) {
          console.error(err);
        }
      });

      const remove = document.createElement('button');
      remove.textContent = '삭제';
      remove.addEventListener('click', async () => { // 삭제 클릭 시
        try {
          const res = await axios.delete(`/gallery/${content._id}`,{ data:{commenter : content.commenter} });
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

function update(content){
  document.write('    <div class="img-preview">');
  document.write('      <img id="img-preview" src="" style="display: none;" width="250" alt="미리보기">');
  document.write('      <input id="img-url" type="hidden" name="url">');
  document.write('    </div>');
  document.write('    <div>');
  document.write('      <label id="img-label" for="img">사진 선택</label>');
  document.write('      <input id="img" type="file" accept="image/*">');
  document.write('      <button id="change_btn" class="btn">업로드</button>');
  document.write('    </div>');
  if (document.getElementById('img')) {
    document.getElementById('img').addEventListener('change', function(e) {
    const formData = new FormData();
    formData.append('img', this.files[0]);
    axios.post('/gallery/img', formData) 
    .then((res) => {
      document.getElementById('img-url').value = res.data.url;
      document.getElementById('img-preview').src = res.data.url;
      document.getElementById('img-preview').style.display = 'inline';
    })
    .catch((err) => {
      console.error(err);
    });
  });
}
if (document.getElementById('change_btn')) {
  document.getElementById('change_btn').addEventListener('click', function(e) {
    var new_img=document.getElementById('img-url').value;
    console.log(content);
    console.log(new_img);
    axios.post(`/gallery/update/${content._id}`,{new_img});
    history.go(0);    
});
}

}
getData();