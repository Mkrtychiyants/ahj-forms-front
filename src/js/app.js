// TODO: write code here

const subscribeWidget = document.querySelector('[data-widget=ticketDeck]');
const tasksList = subscribeWidget.querySelector('ul.ticketList');
const addTicketBtn = subscribeWidget.querySelector('button.addTicket');

function selectButtonCheck(btn) {
  const tkt = btn.closest('.ticket');

  const myInit = {
    method: 'GET',
    credentials: 'same-origin',
  };
  const myRequest = new Request(`http://localhost:7070/?method=updateStatusById&id= + ${tkt.id}`, myInit);

  fetch(myRequest)
    .then((response) => response.json())
    .then(() => {
      const chkt = tkt.querySelector('button.selectTicketBtn');
      chkt.classList.toggle('checked');
    })
    .catch((error) => {
      throw (error);
    });
}
function editButtonCheck(btn) {
  const tkt = btn.closest('.ticket');
  const tktShortDescr = tkt.querySelector('.ticketDescr').innerHTML;
  const tktLongDescr = tkt.querySelector('.ticketDescrLong').innerHTML;
  const editWidgetFrm = document.querySelector('[data-id=changeTicket-form]');
  editWidgetFrm.classList.toggle('active');
  const editWidgetInputs = Array.from(editWidgetFrm.elements).filter(({ name }) => name);
  editWidgetInputs[0].value = tktShortDescr;
  editWidgetInputs[1].value = tktLongDescr;

  editWidgetFrm.addEventListener('submit', () => {
    const postBody = Array.from(editWidgetInputs)
      .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
      .join('&');

    const myInit = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: postBody,
    };
    const myRequest = new Request(`http://localhost:7070/?method=updateById&id=+${tkt.id}`, myInit);
    fetch(myRequest)
      .then((response) => response.json())
      .catch((error) => {
        throw (error);
      });
  });
}
function deleteButtonCheck(btn) {
  const tkt = btn.closest('.ticket');
  const deleteWidgetFrm = document.querySelector('[data-id=deleteTicket-form]');
  deleteWidgetFrm.classList.toggle('active');
  deleteWidgetFrm.addEventListener('submit', () => {
    const myInit = {
      method: 'GET',
      credentials: 'same-origin',
    };
    const myRequest = new Request(`http://localhost:7070/?method=deleteById&id=+${tkt.id}`, myInit);

    fetch(myRequest)
      .then((response) => response.json())
      .catch((error) => {
        throw (error);
      });
  });
}
function buttonCheck(btn) {
  if (btn.classList.contains('selectTicketBtn')) {
    selectButtonCheck(btn);
  }
  if (btn.classList.contains('editTicketBtn')) {
    editButtonCheck(btn);
  }
  if (btn.classList.contains('deleteTicketBtn')) {
    deleteButtonCheck(btn);
  }
}

export default class Task {
  constructor(element, data) {
    this.element = document.querySelector(element);
    this.tasks = data;
  }

  camposeDate(timestamp) {
    this.stamp = new Date(timestamp);
    this.dateStamp = this.stamp.getDate() < 10 ? `0${this.stamp.getDate()}` : this.stamp.getDate();
    this.mounth = this.stamp.getMonth() < 10 ? `0${this.stamp.getMonth()}` : this.stamp.getMonth();
    this.yearStamp = String(this.stamp.getFullYear())[0] + String(this.stamp.getFullYear())[1];
    this.taskDate = `${this.dateStamp}.${this.mounth}.${this.yearStamp}`;
    return this.taskDate;
  }

  camposeTime(timestamp) {
    this.stamp = new Date(timestamp);
    this.hours = this.stamp.getHours() < 10 ? `0${this.stamp.getHours()}` : this.stamp.getHours();
    this.min = this.stamp.getMinutes() < 10 ? `0${this.stamp.getMinutes()}` : this.stamp.getMinutes();
    this.taskTime = `${this.hours}:${this.min}`;
    return this.taskTime;
  }

  renderItem(task) {
    return `
      <li class = "ticket" id=${task.id}> 
      <div class="ticketBody"> 
       <div class="selectTicket"> 
        <button class="selectTicketBtn">
      </button> 
      </div> 
      <div class="ticketDescr">${task.name}</div> 
      <div class="ticketRest"> 
      <div class="ticketDate"> <span class="date">${this.camposeDate(task.created)}</span><span class="time">${this.camposeTime(task.created)}</span></div> 
      <button class="editTicketBtn"><i class="fa-solid fa-pencil"></i> </button> 
      <button class="deleteTicketBtn"><i class="fa-regular fa-circle-xmark"></i> </button> 
      </div> 
      </div> 
      <div class="ticketDescrLong">${task.description}</div> 
    </li>`;
  }

  renderItems(tasks) {
    tasks.forEach((task) => {
      const itemHtml = this.renderItem(task);
      this.element.insertAdjacentHTML('beforeend', itemHtml);
      if (task.status) {
        this.element.lastChild.querySelector('button.selectTicketBtn').classList.add('checked');
      }
    });
  }

  renderTasks() {
    this.renderItems(this.tasks);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const myInit = {
    method: 'GET',
    credentials: 'same-origin',
  };
  const myRequest = new Request('http://localhost:7070/?method=allTickets', myInit);

  fetch(myRequest)
    .then((response) => response.json())
    .then((data) => {
      const tastList = new Task('ul.ticketList', data);
      tastList.renderTasks();
    })
    .catch((error) => {
      throw (error);
    });
});

tasksList.addEventListener('click', (evt) => {
  const tisketClick = evt.target;
  const currentTicket = tisketClick.closest('li.ticket');
  if (tisketClick.closest('button')) {
    const clickedBtn = tisketClick.closest('button');
    buttonCheck(clickedBtn);
    return;
  }
  const myInit = {
    method: 'GET',
    credentials: 'same-origin',
  };
  const myRequest = new Request(`http://localhost:7070/?method=ticketById&id=+${currentTicket.id}`, myInit);
  fetch(myRequest)
    .then((response) => response.json())
    .then((data) => {
      const currentTicketDescr = currentTicket.querySelector('.ticketDescrLong');
      currentTicketDescr.innerHTML = data.description;
      currentTicketDescr.classList.toggle('active');
    })
    .catch((error) => {
      throw (error);
    });
});

addTicketBtn.addEventListener('click', () => {
  const addWidget = document.querySelector('[data-id=addTicket-form]');
  addWidget.classList.toggle('active');
  addWidget.addEventListener('submit', () => {
    const { elements } = addWidget;
    const postBody = Array.from(elements).filter(({ name }) => name)
      .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
      .join('&');

    const myInit = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: postBody,
    };
    const myRequest = new Request('http://localhost:7070/?method=createTicket', myInit);
    fetch(myRequest)
      .then((response) => response.json())
      .catch((error) => {
        throw (error);
      });
  });
});
