console.log(`Hallo World from Frontend (main.js)`);

const linkObj = document.getElementsByTagName(`a`);
const contentObj = document.getElementById(`content`);




const loadPosts_mysql = async () => {

    linkObj[0].classList.add(`active`);
    linkObj[1].classList.remove(`active`);


    const result = await fetch(`http://localhost:3000/blogposts`);
    const data = await result.json();

    let posts = "";

    for (post of data) {
        posts += `<div class="post">
        <h4>${post.id} - ${post.title}</h4>
        <p>${post.content}<p>
        <h6>created at : ${post.created}</h6>
        </div>
        `;
    }

    contentObj.innerHTML = posts;
}; // end loadPosts_mysql

const loadPosts_mongo_DB = async () => {

    linkObj[0].classList.remove(`active`);
    linkObj[1].classList.add(`active`);
    linkObj[2].classList.remove(`active`);

    const result = await fetch(`http://localhost:3000/blogposts_mongo_db`);
    const data = await result.json();

    let posts = "";

    for (post of data) {
        posts += `<div class="post">
        <h4>${post.title}</h4>
        <p>${post.body}</p>
        <h10>created at : ${post.createdAt}</h10></div>
        `;
    }

    contentObj.innerHTML = posts;
} // end loadPosts_mongo_DB

const writePost_mysql_mongo = () => {
    linkObj[0].classList.remove(`active`);
    linkObj[1].classList.remove(`active`);
    linkObj[2].classList.add(`active`);
    contentObj.innerHTML = ` 
    <input type="text" id="titelPost" placeholder="Hier Titel eingeben">
    <textarea id="textPost" cols="60" rows="10" placeholder ="Hier Text eingeben"></textarea>
    <button data-endpoint="blogposts" class="addPost">Artikel in mysql erstellen</button>
    <button data-endpoint="blogpostmongodb" class="addPost">Artikel in mongo erstellen</button>`;

    const addPostObj = document.querySelectorAll('.addPost');

    for (let i = 0; i < addPostObj.length; i++) {

        console.log(addPostObj[i])

        /* if (addPostObj[i].onclick) { */

        addPostObj[i].onclick = async () => {
            console.log(addPostObj[i].dataset.endpoint)

            const titelPostObj = document.getElementById('titelPost');
            const textPostObj = document.getElementById('textPost');

            if (!(titelPostObj.value.length > 0 && textPostObj.value.length > 0)) {
                alert('Alle Felder müssen ausgefüllt sein.');
                return;
            }
            let body
            if (addPostObj[i].dataset.endpoint === "blogpostmongodb") {

                body = {
                    title: titelPostObj.value,
                    body: textPostObj.value
                }

            } else {
                body = {
                    title: titelPostObj.value,
                    content: textPostObj.value
                }
            }
            try {

                const response = await fetch(`http://localhost:3000/${addPostObj[i].dataset.endpoint}`, {

                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    // method: 'writePost',
                    method: 'POST',
                    body: JSON.stringify(body)
                });

                if (response.ok) {

                    responseJson = await response.json();
                    if (addPostObj[i].dataset.endpoint === "blogpostmongodb") {
                        loadPosts_mongo_DB();
                    } else {

                        loadPosts_mysql();
                    }

                }
            } catch (e) {
                console.log('Error: ' + e);
            }
        }
    }
    /*  } */

} // end writePost() 


/* const writePost_mongo_DB = () => {
    linkObj[2].classList.remove(`active`);
    linkObj[3].classList.add(`active`);
    contentObj.innerHTML = ` 
    <input type="text" id="titelPost" placeholder="Hier Titel eingeben">
    <textarea id="textPost" cols="30" rows="10" placeholder ="Hier Text eingeben"></textarea>
    <button id="addPost">Artikel erstellen</button>`;


    const addPostObj = document.getElementById('addPost');

    addPostObj.onclick = async () => {

        const titelPostObj = document.getElementById('titelPost');
        const textPostObj = document.getElementById('textPost');

        if (!(titelPostObj.value.length > 0 && textPostObj.value.length > 0)) {
            alert('Alle Felder müssen ausgefüllt sein.');
            return;
        }


        const post = await Post.create(req.body)
    
        res.json(post);


        const body = {
            title: titelPostObj.value,
            content: textPostObj.value
        }

        try {
            const response = await fetch('http://localhost:3000/blogposts_mongo_db', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                // method: 'writePost',
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (response.ok) {

                responseJson = await response.json();
                loadPosts_mongo_DB();

            }
        } catch (e) {
            console.log('Error: ' + e);
        }
    }
}  */ // end writePost() 