// TODO: write code here

import Task from './Task';

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
    .then((response) => {
      if (response.id === tkt.id) {
        const chkt = tkt.querySelector('button.selectTicketBtn');
        chkt.classList.toggle('checked');
      }
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
    console.log(postBody);
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
