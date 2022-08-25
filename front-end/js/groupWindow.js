const groupList = document.querySelector('#group-list')
// const getGroup=document.getElementById('getgroup');
window.addEventListener('load', async (e) => {
    groupList.innerHTML = ''
    document.getElementById('groupWindow').style.display = 'block'
    let groups = await axios.post('http://localhost:3030/getgroup');

    groups.data.group.forEach(group => {
        console.log(group);
        const div = document.createElement('div');
        div.setAttribute('class', 'group');
        div.setAttribute('id', `${group.usergroup.groupId}`);


        const li = document.createElement('li')
        li.setAttribute('class', 'groupItem')
        li.appendChild(document.createTextNode(`${group.groupName}`))
        div.appendChild(li);

        // const removeButton=document.createElement('button');
        // removeButton.addClass='removeGroup';
        // removeButton.appendChild(document.createTextNode(`remove`))

        // const input=document.createElement('input');
        // input.setAttribute("type", "hidden");
        // input.appendChild(document.createTextNode(`${group.usergroup.groupId}`))
        // div.appendChild(input)

        groupList.appendChild(div);

        groupList.appendChild(document.createElement('hr'));

    })



})

//group Window///

const groupWindow = document.getElementById('groupWindow');
let groupId;
groupWindow.addEventListener('click',  (e) => {
    const group = e.target.parentNode
    // console.log("1", e.target.parentNode);
    groupId = group.id;
    //get all user in a group
    if (group.className === "group") {
        console.log(e.target);
        console.log(group.id);
        axios.get(`http://localhost:3030/users/${group.id}`)
            .then(response => {
                // console.log(response);
                if (response.status == 200) {
                    document.getElementById('chats').innerHTML = ``
                    document.getElementById('groupUsers').innerHTML = ``
                    console.log("group",response.data.group[0]);
                    response.data.group[0].registers.forEach(user => {
                        showUsers(user);
                        console.log("users", user);
                        document.getElementById('userSection').style.display = 'block'
                        document.getElementById('groupUsers').style.display = 'block'
                        document.getElementById('addUserInGroup').style.display='block'
                        document.getElementById('addUserInGroup').firstElementChild.innerHTML=`Add User into ${response.data.group[0].groupName}`

                        
                    });
                    console.log(response);
                } else {
                    throw new Error();
                }
            })
            .catch(err => { console.log(err) })

    }
    //get all msg from a group
    if (e.target.className === "groupItem") {
        console.log("lisghsgjgdjd>>>>>");
        const timer = setInterval(() => {

            console.log("e",);
            //   const lastMsgId=localStorage.getItem('lastMsgId')
            //   console.log('lastMsgId',lastMsgId);
            axios.get(`http://localhost:3030/getgroupmessage/${groupId}`)
                .then(response => {
                    const { msgs } = response.data
                    //   parentNode.innerHTML='';

                    if (response.status == 200) {
                        console.log(msgs);
                        document.getElementById('msg').innerHTML = ``;
                        msgs.forEach(msg => {
                            console.log(msg);
                            // localStorage.setItem("lastMsgId", msg.id);
                            showMessage(msg.register.name, msg.message)
                        });
                    } else {
                        throw new Error();
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }, 500)

        // setTimeout(() => {
        //     clearTimeout(timer)
        // }, 2000)

    }
    //create new admin
    if(e.target.className==="createAdmin"){
        // console.log("admin");

        const groupId=e.target.parentNode.lastElementChild.value;
        // console.log(groupId);
        const obj={
            userId:e.target.parentNode.firstElementChild.id
        } 
        console.log(">>>>>>>",userId);
        
        axios.post(`http://localhost:3030/createadmin/${groupId}`,obj)
            .then(data=>{
                console.log("admin",data);
                if(data.data.nowAdmin===false){
                    alert('user already admin')
                }
                if(data.data.nowAdmin===true){
                    alert('user now admin')
                }
                
                
            // e.target.innerHTML='remove'
            })
            .catch(err=>{console.log(err);})
        
        
            
    }
    //remove admin...
    if(e.target.id==="removeAdmin"){
        console.log("admin");
        const userId=e.target.parentNode.firstElementChild.id;
        console.log(userId);
        const groupId=e.target.parentNode.lastElementChild.value;
        // console.log(groupId);
        const obj={
            userId:e.target.parentNode.firstElementChild.id
        } 
        console.log(">>>>>>>",userId);
        
        axios.post(`http://localhost:3030/removeadmin/${groupId}`,obj)
            .then(data=>{
                console.log("admin",data);
                if(data.data.nowAdmin===false){
                    alert('user no longer as admin')
                }
                if(data.data.nowAdmin===true){
                    alert('user already no longer admin')
                }
                
                
            // e.target.innerHTML='remove'
            })
            .catch(err=>{console.log(err);})
    }



});

// const groupUsers = document.getElementById('chats');
const groupUsers = document.getElementById('groupUsers')
function showUsers(user) {
    groupUsers.innerHTML += `
        <div >
            
            <li id=${user.id}> ${user.name} join... </li>
            <button type="submit" id="createAdmin" class="createAdmin">Create Admin</button> 
            <button type="submit" id="removeAdmin"  class="removeAdmin">Remove Admin</button>
            <input type="text"  value=${groupId} hidden>
        </div>
        <hr>
        `
}

async function sendMsg(event) {
    event.preventDefault();
    const msg = event.target.msg.value
    console.log("mssg", msg);
    console.log("groupId>>", groupId);
    const obj = { msg }
    const response = await axios.post(`http://localhost:3030/creategroupmessage/${groupId}`, obj)
    // console.log(response);
    showMessage(response.data.name, response.data.message.message)
    event.target.msg.value = '';
}


const parentNode = document.getElementById('msg');
function showMessage(name, msg) {
    parentNode.innerHTML += `<li>${name}:${msg}</li>`
}

//add user into a existing group by admin only
document.getElementById('addUser').addEventListener('click', async (e) => {
    // const groupId=document.getElementById('groupId').value
    const obj = {
        userId: document.getElementById('userId').value,
        email: document.getElementById('email').value,
    }
    console.log(groupId);
    const user = await axios.post(`http://localhost:3030/addingroup/${groupId}`, obj);
    if (user.data.added) {
        alert("user added");
    } 
    if(user.data.added==false) {
        alert(`${user.data.email} not a addmin`)
    }
    if(user.data.user==false){
        alert(`${obj.email} not exist`)
    }

})
