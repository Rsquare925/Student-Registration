const form = document.getElementById('form')
const saveBtn = document.getElementById('save')
const addBtn = document.getElementById('add')
const studentNameEle = document.getElementById('student-name')
const studentIdEle = document.getElementById('student-id')
const studentEmailEle = document.getElementById('student-email')
const studentContactEle = document.getElementById('student-contact')


// this funciton add error class to parent div of particular input tag
function addError(element, msg){
    const parent = element.parentNode
    parent.classList.add('error')
    parent.style.setProperty('--after-content', msg)
}

function removeError(element){
    const parent = element.parentNode
    parent.classList.remove('error')
}

// this function counts sibling before particular element
function countSiblingsBefore(element) {
    let count = 0
    while ((element = element.previousElementSibling)) {
        count++
    }
    return count
}

function addTableData(data){
    // Check if the item exists in local storage
    const existingData = localStorage.getItem('rows')
    // If it doesn't exist, create a new item with a list
    if (existingData == null) {
        const newData = [data]
        localStorage.setItem('rows', JSON.stringify(newData))
    } 
    else{
        // If it exists, parse the JSON string to get the list, append your new list, and set it back into local storage
        const parsedData = JSON.parse(existingData)
        parsedData.push(data)
        localStorage.setItem('rows', JSON.stringify(parsedData))
    }

}

// this will create rows in table
function addTableRow(rowData) {
    // Find the table element by ID
    let table = document.getElementById('table')
    // Create a new row element
    let newRow = table.insertRow()

    // Add four cells to the new row
    for (let data of rowData) {
        // Create a new cell element
        let newCell = newRow.insertCell()

        // Set the cell's text content to the corresponding value in the rowData array
        newCell.textContent = data
    }

    edit = newRow.insertCell()
    del = newRow.insertCell()
    edit.innerHTML = "<button class='edit'>Edit</button>"
    del.innerHTML = "<button class='delete'>Delete</button>"
}

// this function is for validating student name and contact
function validateNameAndContact(studentNameEle, studentContactEle){
    const regex = /^[a-zA-Z]+$/

    // checking studnent name must be at least 4 character
    if (!studentNameEle['value'] || studentNameEle['value'].length < 4 || !regex.test(studentNameEle['value'])){
        addError(studentNameEle, "'Must be more than 3 characters'")
        return false
    }
    else {
        removeError(studentNameEle)
        
    }

    // checking contact no must be 10 digits
    if(studentContactEle['value'].length < 10 || studentContactEle['value'].length > 10){
        addError(studentContactEle, "'Must be 10 digits'")
        return false
    }
    else {
        removeError(studentContactEle)
    }
    return true
}

form.addEventListener('submit', (event)=>{
    studentNameEle['value'] = studentNameEle['value'].trim()
    // Regular expression to match only letters (a-zA-Z)

    if (!validateNameAndContact(studentNameEle, studentContactEle)){
        event.preventDefault()
        return 
    }
    
    data = [studentNameEle['value'], studentIdEle['value'], studentEmailEle['value'].trim(), studentContactEle['value']]

    addTableData(data)
    addTableRow(data)
    
})

// this is for preventing the submission of form when submit btn is display:none (during editing of a record)
form.addEventListener('keydown', function(event) {
    // Check if the Enter key was pressed and the submit button is visible
    if (event.key === 'Enter' && window.getComputedStyle(addBtn).display === 'none') {
        // Prevent form submission
        event.preventDefault()
    }
});

// this is for editing any particular row
function editRow(){
    // this will hide add btn and add save btn
    addBtn.classList.add('hidden')
    saveBtn.classList.remove('hidden')

    const parent = this.parentNode.parentNode
    const data = parent.getElementsByTagName('td')


    // this will enter the value of particular row in input fields for editing
    studentNameEle['value'] = data[0].textContent
    studentIdEle['value'] = data[1].textContent
    studentEmailEle['value'] = data[2].textContent
    studentContactEle['value'] = data[3].textContent

    saveBtn.addEventListener('click', ()=>{
        if (!validateNameAndContact(studentNameEle, studentContactEle)){
            return 
        }
        count = countSiblingsBefore(parent) - 1

        const existingData = localStorage.getItem('rows')

        const parsedData = JSON.parse(existingData);
        parsedData[count][0] = studentNameEle['value']
        parsedData[count][1] = studentIdEle['value']
        parsedData[count][2] = studentEmailEle['value']
        parsedData[count][3] = studentContactEle['value']
        localStorage.setItem('rows', JSON.stringify(parsedData))

        addBtn.classList.remove('hidden')
        saveBtn.classList.add('hidden')
        location.reload()
    })

}


// this is for deleting any particular row
function delRow(){
    const arr = JSON.parse(localStorage.getItem('rows'))
    const parent = this.parentNode.parentNode
    const index = countSiblingsBefore(parent) - 1
    // this is checking if there is more than 1 row in table
    if (arr.length > 1){
        arr.splice(index, 1)
        localStorage.setItem('rows', JSON.stringify(arr))
    }
    else{
        localStorage.removeItem('rows');
    } 
    
    location.reload()
}



// this event will load the data saved in local storage to table
document.addEventListener("DOMContentLoaded", ()=> {
    // Code to execute when the page finishes loading
    rows = localStorage.getItem('rows')

    // this will run when there is some data
    if (rows){
        for (let data of JSON.parse(rows)){
            addTableRow(data)
        }
        const editBtns = document.getElementsByClassName('edit')
        const delBtns = document.getElementsByClassName('delete')

        // this is for add event listener on edit btns
        for (let btn of editBtns){
            btn.addEventListener('click', editRow)
        } 
        
        // this is for add event listener on delete btns
        for (let btn of delBtns){
            btn.addEventListener('click', delRow)
        }  
    }  

})






