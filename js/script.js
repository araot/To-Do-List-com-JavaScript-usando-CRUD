
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const search = document.getElementById('search-input');
  
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
  
    function saveToLocalStorage() {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  
    function createTodoElement(text, completed = false) {
      const li = document.createElement('li');
      if (completed) li.classList.add('done');
  
      const span = document.createElement('span');
      span.textContent = text;
  
      const actions = document.createElement('div');
      actions.className = 'actions';
  
      const completeBtn = document.createElement('button');
      completeBtn.textContent = 'Concluir';
      completeBtn.className = 'complete-btn';
      completeBtn.onclick = () => {
        li.classList.toggle('done');
        const index = todos.findIndex(t => t.text === text);
        todos[index].completed = !todos[index].completed;
        saveToLocalStorage();
      };
  
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.className = 'edit-btn';
      editBtn.onclick = async () => {
        const { value: newText } = await Swal.fire({
          title: 'Editar tarefa',
          input: 'text',
          inputLabel: 'Nova descrição da tarefa:',
          inputValue: text,
          showCancelButton: true,
          confirmButtonText: 'Salvar',
          cancelButtonText: 'Cancelar',
          inputValidator: (value) => {
            if (!value.trim()) return 'O campo não pode estar vazio!';
            if (
              todos.some(
                (t) =>
                  t.text.toLowerCase().trim() === value.toLowerCase().trim() &&
                  t.text !== text
              )
            ) {
              return 'Essa tarefa já existe!';
            }
          },
          customClass: {
            container: 'swal2-container',
            popup: 'swal2-popup',
            title: 'swal2-title',
            input: 'swal2-input',
            confirmButton: 'swal2-confirm',
            cancelButton: 'swal2-cancel',
          }
        });
  
        if (newText && newText.trim() !== '') {
          const index = todos.findIndex((t) => t.text === text);
          todos[index].text = newText.trim();
          saveToLocalStorage();
          span.textContent = newText.trim();
  
          Swal.fire({
            icon: 'success',
            title: 'Tarefa atualizada!',
            text: 'Sua tarefa foi atualizada com sucesso.',
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              popup: 'swal2-popup-success',
              title: 'swal2-title-success'
            }
          });
        }
      };
  
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Excluir';
      deleteBtn.className = 'delete-btn';
      deleteBtn.onclick = async () => {
        const result = await Swal.fire({
          title: 'Tem certeza?',
          text: `Você deseja excluir a tarefa "${text}"?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#e74c3c',
          cancelButtonColor: '#aaa',
          confirmButtonText: 'Sim, excluir!',
          cancelButtonText: 'Cancelar',
          customClass: {
            container: 'swal2-container',
            popup: 'swal2-popup-warning',
            confirmButton: 'swal2-confirm-warning',
          }
        });
  
        if (result.isConfirmed) {
          list.removeChild(li);
          todos = todos.filter((t) => t.text !== text);
          saveToLocalStorage();
  
          Swal.fire({
            icon: 'success',
            title: 'Tarefa excluída!',
            text: 'Sua tarefa foi excluída com sucesso.',
            timer: 1200,
            showConfirmButton: false,
            customClass: {
              popup: 'swal2-popup-success',
              title: 'swal2-title-success'
            }
          });
        }
      };
  
      actions.appendChild(completeBtn);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      li.appendChild(span);
      li.appendChild(actions);
      list.appendChild(li);
    }
  
    function renderTodos(filter = '') {
      list.innerHTML = '';
      todos
        .filter((todo) => todo.text.toLowerCase().includes(filter.toLowerCase()))
        .forEach((todo) => createTodoElement(todo.text, todo.completed));
    }
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
  
      if (text === '') {
        Swal.fire({
          icon: 'warning',
          title: 'Campo obrigatório!',
          text: 'Por favor, preencha o campo de tarefa antes de adicionar.',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal2-popup-warning',
            title: 'swal2-title-warning'
          }
        });
        return;
      }
  
      const exists = todos.some(
        (todo) => todo.text.toLowerCase().trim() === text.toLowerCase()
      );
  
      if (exists) {
        Swal.fire({
          icon: 'error',
          title: 'Tarefa já existe!',
          text: 'Você não pode cadastrar a mesma tarefa duas vezes.',
          confirmButtonText: 'Entendi',
          customClass: {
            popup: 'swal2-popup-error',
            title: 'swal2-title-error'
          }
        });
        return;
      }
  
      todos.push({ text, completed: false });
      saveToLocalStorage();
      createTodoElement(text);
      input.value = '';
    });
  
    search.addEventListener('input', () => {
      renderTodos(search.value);
    });
  
    renderTodos();
  });
  
  