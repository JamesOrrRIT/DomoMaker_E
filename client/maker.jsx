const helper = require('./helper.js');
let csrfToken;

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector("#domoAge").value;
    const note = e.target.querySelector("#domoNote").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if(!name || !age || !note)
    {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, note, _csrf}, loadDomosFromServer);

    return false;
}

const removeDomo = async (e) =>
{
    e.preventDefault();
    helper.hideError();

    const _id = e.target.querySelector("#domoId").value;
    const _csrf = e.target.querySelector("#_csrf").value;
    if(!_id || !_csrf)
    {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {_id, _csrf}, loadDomosFromServer);

    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
        onSubmit={handleDomo}
        name="domoForm"
        action="/maker"
        method="POST"
        className="domoForm"
        >
            <div id="formBreak">
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            </div>
            
            <div id="formBreak">
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            </div>

            <div id="formBreak">
            <label htmlFor="domoNote">Note: </label>
            <input id="domoNote" type="text" name="note" placeholder="Note for Domo" />
            </div>

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
}

const DomoList = (props) => {
    if(props.domos.length === 0)
    {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        return (
            <div key = {domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoNote">Note: {domo.note} </h3>
                <form action="/removeDomo" onSubmit={removeDomo} method="GET" className="deleteButton">
                    <input id="domoId" type="hidden" name="_id" value={domo._id} />
                    <input id="_csrf" type="hidden" name="_csrf" value={csrfToken} />
                    <input className="deleteButton" class="delete" type="submit" value="Delete Domo?" />
                </form>
            </div>
        );
    });

    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();
    csrfToken = data.csrfToken;
    ReactDOM.render(
        <DomoForm csrf={csrfToken} />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );

    loadDomosFromServer();
}

window.onload = init;