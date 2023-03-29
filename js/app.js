// Globales 
const log = log => console.log(log);
const $ = selector => document.querySelector(selector);
const $createElement = create => document.createElement(create);


//Selectores 
const form = $('#agregar-gasto');
const listadoGasto = $('.list-group');
const buttonForm = $('button[type = "submit"]');


//AddEventListener
logEventListener();
function logEventListener() {

    //Cargando el HTML de preguntar Presupuesto
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    // Validar formulario
    form.addEventListener('submit', agregarGasto);
}


//Class

class Presupuesto {

    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    agregarGastos(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularGasto();
    }

    calcularGasto() {
        const gastosRestante = this.gastos.reduce((presupuestoTotal, presupuestoActual) => {
            return presupuestoTotal + presupuestoActual.cantidadGasto;
        }, 0);

        //Devolver el restante 
        this.restante = this.presupuesto - gastosRestante;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(remove => remove.id !== id);

        //If delete the cost return the remaining
        this.calcularGasto();
    }

}

class UI {

    mostrarPresupuestoRestante(presupuestoRestante) {

        const { presupuesto, restante } = presupuestoRestante;

        //Mostrar el  presupuesto 
        const presupuestoTotal = $('#total');
        presupuestoTotal.className = 'fw-bolder'
        presupuestoTotal.textContent = currency(presupuesto);

        //Mostrar el restante 
        const restantePresupuesto = $('#restante');
        restantePresupuesto.className = 'fw-bolder';
        restantePresupuesto.textContent = currency(restante);
    }

    showAlert(message, type) {

        this.removeAlert();
        //Crear element de alert
        const messageAlert = $createElement('p');
        messageAlert.className = 'remove text-center alert text-white fw-bold text-uppercase';

        if (type === 'error') {
            messageAlert.classList.add('bg-danger')

        } else {
            messageAlert.classList.add('bg-success')
        }

        //Show the message in the HTML
        messageAlert.textContent = message;


        //Show the alert in the HTML
        const locationElement = $('.primario');
        locationElement.insertBefore(messageAlert, form);

        setTimeout(() => {
            messageAlert.remove();
        }, 3000);

    }

    //Delete Alert previous
    removeAlert() {
        const alertRemove = $('.remove');
        if (alertRemove !== null) {
            alertRemove.remove();
        }
    }

    //Show the costs
    mostrarGasto(gastos) {

        //Clean firts children
        this.clean();

        //Recorrer todo el arreglo de gasto
        gastos.forEach(gasto => {
            const { cantidadGasto, nombreGasto, id } = gasto;

            //Create element for show in the list 
            const gastoList = $createElement('li');

            //Atributte dataset
            gastoList.dataset.id = id;

            //Class the style for list
            gastoList.className = 'list-group-item d-flex justify-content-between align-items-center';

            //Show in the HTML list cost
            gastoList.innerHTML = `
             ${nombreGasto} <span class = "badge badge-primary badge-pill">$${cantidadGasto}</span>`;

            //Create button in the list cost
            const btnDelete = $createElement('button');
            //Class style button
            btnDelete.classList.add('btn', 'btn-danger');

            // Text button
            btnDelete.innerHTML = `<span><i class='bx bx-trash-alt'></i> Borrar </span>`;

            //Function the onclick
            btnDelete.onclick = () => {
                eliminarGasto(id);
            }
            //Insert button in the list cost
            gastoList.appendChild(btnDelete);

            //Insert en el HTML
            listadoGasto.appendChild(gastoList);
        });
    }

    actualizarRestante(restanteGasto) {
        const restantePresupuesto = $('#restante');
        restantePresupuesto.textContent = currency(restanteGasto);
    }

    //Comprobar presupuesto restante
    comprobarRestante(restantePresupuesto) {
        const { presupuesto, restante } = restantePresupuesto;

        //Show the change of interation 
        const interationRemaining = $('.restante');
        //Validate if the remainder exceeds 25%
        if ((presupuesto / 4) > restante) {
            interationRemaining.classList.remove('alert-success', 'alert-warning');
            interationRemaining.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            interationRemaining.classList.remove('alert-success', 'alert-danger');
            interationRemaining.classList.add('alert-warning')
        } else {
            interationRemaining.classList.remove('alert-warning', 'alert-danger');
            interationRemaining.classList.add('alert-success');
        }

        // Si execde el total del presupuesto mostrar alerta y desactivar button
        if (restante <= 0) {
            ui.showAlert('Pasate del limite de tu presupuesto', 'error');
            buttonForm.disabled = true;
            return;
        }

        //Activar nuevamente el button si return the remaining
        buttonForm.disabled = false;
    }

    //Clean the child previous 
    clean() {
        while (listadoGasto.firstChild) {
            listadoGasto.removeChild(listadoGasto.firstChild);
        }
    }

}

//Instarciar class

//Presupuesto
let presupuesto;

//Usuario
const ui = new UI();
log(ui);


//Funciones

function preguntarPresupuesto() {

    //Pregutar al usuario 
    const preguntarUsuario = Number(prompt('Cual es tu presupuesto ?'));

    //Validar
    if (preguntarUsuario === "" || preguntarUsuario === null || isNaN(preguntarUsuario) || preguntarUsuario <= 0) {
        window.location.reload();
    }

    //Instanciar la clase de presupuesto
    presupuesto = new Presupuesto(preguntarUsuario);

    //Mostrar el presupuesto escrito por le usuario
    ui.mostrarPresupuestoRestante(presupuesto);
}

//Validar formulario de gasto 
function agregarGasto(e) {
    e.preventDefault();

    //Valores de los input gastos y cantidad
    const nombreGasto = $('#gasto').value;
    const cantidadGasto = Number($('#cantidad').value);

    //Validar los input gastos y cantidad
    if (nombreGasto === '' || cantidadGasto === '') {
        ui.showAlert('Los campos son obligatorios', 'error');
        return;
    }
    else if (!isNaN(nombreGasto)) {
        ui.showAlert('Campo gasto solo caracteres', 'error');
        return;
    } else if (cantidadGasto <= 0 || isNaN(cantidadGasto)) {
        ui.showAlert('Cantidad invalidad o caracter no valido', 'error');
        return;
    }


    //Crear objeto para agregar al arreglo
    const objGastos = {
        nombreGasto,
        cantidadGasto,
        id: Date.now()
    }

    //Instarciar objeto en la clase
    presupuesto.agregarGastos(objGastos);

    //Validation the message correct
    ui.showAlert('Gasto enviado correctamente');

    //Mostrar los gasto en el HTML 
    const { gastos, restante } = presupuesto;
    ui.mostrarGasto(gastos);

    //Update the date restante
    ui.actualizarRestante(restante);

    //Comprobar la validacion de restante 
    ui.comprobarRestante(presupuesto);

    //Reiniciar formulario
    form.reset();
}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);

    const { gastos, restante } = presupuesto;
    ui.mostrarGasto(gastos);

    //Update the cost delete that return again
    ui.actualizarRestante(restante);

    //Find out the remaining
    ui.comprobarRestante(presupuesto);
}

//Format my country's currency
function currency(money) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'DOP',
        minimumFractionDigits: 2
    }).format(money);
}



