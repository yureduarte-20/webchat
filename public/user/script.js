$('#registerForm').on('submit', e => {
    e.preventDefault()
    const body = {}
    for (const input of e.target) {
        if (input.type !== 'submit') {
            body[input.name] = input.value
        }
    }
    if (body.password !== body.confirmPassword) {
        return errorMessage("A senha precisa ser igual ao confirmar senha")
    }
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    fetch("http://localhost:3000/users", {
        body: JSON.stringify(body),
        method: 'POST',
        headers: headers
    })
    .then(response => response.status < 300  ? response.json() : Promise.reject(response))
    .then(data => {
        successMessage('Usuário criado com sucesso')
        window.location.href = "/index.html"
    })
    .catch(async e =>{
        if(e.status && e.status >= 400 && e.status < 500){
            const d = await e.json()
            console.log(d)
            return errorMessage(d.message)
        }
        return errorMessage('Não foi possível criar o usuário')
    })
})


