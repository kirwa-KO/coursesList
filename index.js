
coursesList = document.querySelector('ul');
courseFrom = document.querySelector('form');

const addListItem = (course, id) => {
    html = `<li class="list-group-item" data-id="${id}">
                <h3>${course.title}</h3>
                <small>${course.created_at.toDate()}</small>
                </br>
                <button class="btn btn-danger btn-sm my-3" value="delete">Delete</button>
                <button class="btn btn-warning btn-sm my-3" style="color: white" value="edit">Edit</button>
            </li>`
    coursesList.innerHTML += html;
}

// db.collection("courses").get()
//     .then(res => res.docs.forEach(course => {
//         addListItem(course.data(), course.id)
//     }))
//     .catch(err => console.error(err))

const removeListItem = id => {
    const courses = document.querySelectorAll('li');
    courses.forEach(course => {
        if (course.getAttribute('data-id') == id)
            course.remove();
    })
}

db.collection("courses").onSnapshot(snap => {
    snap.docChanges().forEach(course => {
        if (course.type === "added")
            addListItem(course.doc.data(), course.doc.id);
        else
            removeListItem(course.doc.id)
    })
})

courseFrom.addEventListener('submit', e => {
    e.preventDefault();
    const now = new Date();
    const course = {
        title: courseFrom.course.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    }
    // courseFrom.course.value = ''
    db.collection("courses").add(course)
        .then(res => courseFrom.reset())
        .catch(err => console.error(err))
});

coursesList.addEventListener('click', e => {
    if (e.target.tagName === "BUTTON")
    {
        const id = e.target.parentElement.getAttribute('data-id');
        if (e.target.value === "delete")
        {
            db.collection('courses').doc(id).delete()
                .then( _ => console.log("Course Deleted..!!"))
                .catch(err => console.error(err))
        }
        else
        {
            if (e.target.value === "edit")
            {
                const now = new Date();
                db.collection('courses').doc(id).set({
                    title: "Kirwa-KO",
                    created_at: firebase.firestore.Timestamp.fromDate(now)
                })
                .then(res => console.log("Course Edited..!!"))
                .catch(err => console.error(err))
            }
        }
    }
})
