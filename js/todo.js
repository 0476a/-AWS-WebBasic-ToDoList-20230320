class TodoEvent {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new TodoEvent();
        }
        return this.#instance;
    }

    currentFilter = "all";

    addEventTodoAddButton() {
        const todoAddButton = document.querySelector(".todo-add-button");
        const todoAddInput = document.querySelector(".todo-add-input");
        const todoAddHidden = document.querySelector(".todo-add-hidden-blank div");

        todoAddButton.onclick = () => {
            if(todoAddInput.value == '') {
                TodoService.getInstance().blankTodo();
            }else {
                TodoService.getInstance().addTodo();
                todoAddHidden.classList.add("hidden-blank");
                if(this.currentFilter == "ing"){
                    this.addEventTodoIngClick();
                }

                if(this.currentFilter == "complete"){
                    this.addEventTodoCompleteClick()
                }
            }
        }
    }

    addEventTodoDeleteButton() {
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach((deleteButton,index) => {
            deleteButton.onclick = () => {
                TodoService.getInstance().deleteTodo(index);
                if(this.currentFilter == "ing"){
                    this.addEventTodoIngClick();
                }

                if(this.currentFilter == "complete"){
                    this.addEventTodoCompleteClick()
                }
            }
        });
    }

    addEventTodoCheckClick() {
        const checkButtons = document.querySelectorAll(".todo-check");
        checkButtons.forEach((checkButton,index) => {
            checkButton.onclick = () => {
                const todoMessages = document.querySelectorAll(".todo-message");
                if(checkButton.checked) {
                    todoMessages[index].style.textDecoration = "line-through";
                    TodoService.getInstance().todoList[index].todoChecked = true;
                    if (this.currentFilter == "ing") {
                        this.addEventTodoIngClick();
                    }
                } else {
                    todoMessages[index].style.textDecoration = "none";
                    TodoService.getInstance().todoList[index].todoChecked = false;
                    if (this.currentFilter == "complete") {
                        this.addEventTodoCompleteClick();
                    }
                }
                localStorage.setItem("todoList", JSON.stringify(TodoService.getInstance().todoList));
                ShowCount.getInstance().updateCheckedCount();
                this.addEventTodoCountClick();
            }
        });
    }

    addEventTodoAllClick() {
        const checkButtons = document.querySelectorAll(".todo-check");
        checkButtons.forEach((checkButton,index) => {
            const todoMessages = document.querySelectorAll(".todo-message");
            const todoCheckMessages = document.querySelectorAll(".todo-check-message");
            todoCheckMessages[index].style.display = "flex";
            if(checkButton.checked) {
                todoMessages[index].style.textDecoration = "line-through";
                TodoService.getInstance().todoList[index].todoChecked = true;
            } else {
                todoMessages[index].style.textDecoration = "none";
                TodoService.getInstance().todoList[index].todoChecked = false;
            }
            localStorage.setItem("todoList", JSON.stringify(TodoService.getInstance().todoList));
        });
    }

    addEventTodoIngClick() {
        const checkButtons = document.querySelectorAll(".todo-check");
        checkButtons.forEach((checkButton,index) => {
            const todoMessages = document.querySelectorAll(".todo-message");
            const todoCheckMessages = document.querySelectorAll(".todo-check-message");
            if(checkButton.checked) {
                todoCheckMessages[index].style.display = "none";
                TodoService.getInstance().todoList[index].todoChecked = true;
            } else {
                todoCheckMessages[index].style.display = "flex";
                todoMessages[index].style.textDecoration = "none";
                TodoService.getInstance().todoList[index].todoChecked = false;
            }
            localStorage.setItem("todoList", JSON.stringify(TodoService.getInstance().todoList));
        });
    }

    addEventTodoCompleteClick() {
        const checkButtons = document.querySelectorAll(".todo-check");
        checkButtons.forEach((checkButton,index) => {
            const todoMessages = document.querySelectorAll(".todo-message");
            const todoCheckMessages = document.querySelectorAll(".todo-check-message");
            if(!checkButton.checked) {
                todoCheckMessages[index].style.display = "none";
                TodoService.getInstance().todoList[index].todoChecked = false;
            } else {
                todoCheckMessages[index].style.display = "flex";
                todoMessages[index].style.textDecoration = "line-through";
                TodoService.getInstance().todoList[index].todoChecked = true;
            }
            localStorage.setItem("todoList", JSON.stringify(TodoService.getInstance().todoList));
        });
    }


    addEventTodoCountClick() {
        const todoCountAll = document.querySelector(".todo-count-all");
        todoCountAll.onclick = () => {
            this.currentFilter = "all";
            this.addEventTodoAllClick();
        }

        const todoCountIng = document.querySelector(".todo-count-ing");
        todoCountIng.onclick = () => {
            this.currentFilter = "ing";
            this.addEventTodoIngClick();
        }

        const todoCountComplete = document.querySelector(".todo-count-complete");
        todoCountComplete.onclick = () => {
            this.currentFilter = "complete";
            this.addEventTodoCompleteClick();
        }
    }
}

class TodoService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new TodoService();
        }
        return this.#instance;
    }

    todoList = null;

    constructor() {
        if(localStorage.getItem("todoList") == null) {
            this.todoList = new Array();
        } else {
            this.todoList = JSON.parse(localStorage.getItem("todoList"));
        }
        this.loadTodoList();
    }

    blankTodo() {
        const todoAddHidden = document.querySelector(".todo-add-hidden-blank div");
        if(todoAddHidden.classList.contains("hidden-blank")) {
            todoAddHidden.classList.remove("hidden-blank");
        }
    }
    
    addTodo() {
        const todoAddInput = document.querySelector(".todo-add-input");

        const todoObj = {
            todoContent: todoAddInput.value,
            todoChecked: false
        };
        this.todoList.push(todoObj);
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
        this.loadTodoList();
    }

    deleteTodo(deleteIndex) {
        this.todoList.splice(deleteIndex,1);
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
        this.loadTodoList()
    }

    loadTodoList() {
        const todoCheckList = document.querySelector(".todo-check-list");
        todoCheckList.innerHTML = ``;
        this.todoList.forEach(todoObj => {
            const checkedStatus = todoObj.todoChecked ? "checked" : "";
            const decorationStatus = todoObj.todoChecked? "line-through" : "none";
            todoCheckList.innerHTML += `
                <li class="todo-check-message">
                    <input type="checkbox" class="todo-check" ${checkedStatus}>
                    <div class="todo-message" style="text-decoration: ${decorationStatus};">${todoObj.todoContent}</div>
                    <button class="delete-button">❌</button>
                </li>
            `;
            
        });
        TodoEvent.getInstance().addEventTodoDeleteButton();
        TodoEvent.getInstance().addEventTodoCheckClick();
        ShowCount.getInstance().updateCheckedCount();
        ShowCount.getInstance().totalCount(this.todoList.length);
        TodoEvent.getInstance().addEventTodoCountClick()
    }
}

class ShowCount {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new ShowCount();
        }
        return this.#instance;
    }

    totalCount(length) {
        const all = document.querySelector(".all");
        all.innerHTML = `
            <button class="todo-count-all">전체:${length}</button>
        `
    }

    updateCheckedCount() {
        const checkButtons = document.querySelectorAll(".todo-check");
        const complete = document.querySelector(".complete");
        const ing = document.querySelector(".ing");
        let checkedCount = 0;
        let uncheckedCount = 0;
        if(checkButtons.length == 0) {
            ing.innerHTML = `
                <button class="todo-count-ing">진행중:${uncheckedCount}</button>
            `;
            complete.innerHTML = `
                <button class="todo-count-complete">완료:${checkedCount}</button>
            `;
        }
        checkButtons.forEach((checkButton) => {
            if (checkButton.checked) {
                checkedCount++;
                complete.innerHTML = `
                    <button class="todo-count-complete">완료:${checkedCount}</button>
                `;
                if(uncheckedCount == 0) {
                    ing.innerHTML = `
                    <button class="todo-count-ing">진행중:${uncheckedCount}</button>
                `;
                }
            } else {
                uncheckedCount++;
                ing.innerHTML = `
                <button class="todo-count-ing">진행중:${uncheckedCount}</button>
                `;
                if(checkedCount == 0) {
                    complete.innerHTML = `
                    <button class="todo-count-complete">완료:${checkedCount}</button>
                `;
                }
            }
        });
    }
}