console.log(`Hallo World from Frontend (main.js)`);

const linkObj = document.getElementsByTagName(`a`);
const contentObj = document.getElementById(`content`);

const loadPosts = async () => {
    
    linkObj[0].classList.add(`active`);
    linkObj[1].classList.remove(`active`);
    
    
    const result = await fetch(`http://localhost:3000/blogposts`);
    const data = await result.json();
    
    let posts="";

    for (post of data) {
        posts += `<div class="post">
        <h4>${post.id} - ${post.title}</h4>
        <h6>created at : ${post.created}</h6>
        <p>${post.content}<p></div>
        `;
    }

    contentObj.innerHTML =posts;
}; // end loadPosts

const writePost = () => {
    linkObj[0].classList.remove(`active`);
    linkObj[1].classList.add(`active`);
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

        const body = {
            title : titelPostObj.value,
            content: textPostObj.value
        }

        try {
            const response = await fetch('http://localhost:3000/blogposts', {
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
                loadPosts();

            }
        } catch (e) {
            console.log('Error: ' + e);
        }
    }
} // end writePost() 
