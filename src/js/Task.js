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
