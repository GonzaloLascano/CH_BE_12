const socket = io.connect();

function sendMsg(e) {
    /* document.getElementById("messageButton") */
    let message = {content: document.getElementById('content').value, date: Date(), user: document.getElementById('userMail').value}
    socket.emit('message', message)
}

function sendProduct(){
    let newProduct = { 
        producto: document.getElementById('prodTitle').value, 
        precio: parseInt(document.getElementById('prodPrice').value), 
        thumbnail: document.getElementById('prodThumb').value
    }
    socket.emit('newProd', newProduct)
}

function handleRenderer(productList){
    console.log(productList)
    if (productList.length > 0) {
        let tBody = document.getElementById('table_body')
        tBody.innerHTML = ''
        const template = Handlebars.compile(`
        <th scope="row">{{id}}</th>
        <td>{{title}}</td>
        <td>$ {{price}}</td>
        <td><img src={{img}}></td>
        `)
        
        for (product of productList) {
            console.log(product)
            const html = template({id: product.id, title: product.producto, price: product.precio, img: product.thumbnail})
            const tr = document.createElement('tr')
            tr.innerHTML = html
            tBody.appendChild(tr)
        }
    }
}

socket.on('refresh', (data) => {
    function appendMessge(content){
        let msg = document.createElement('p')
        msg.innerHTML = `
            <span class="mail fw-bold text-primary">${content.user} </span>
            <span class="date" style="color: brown;">${content.date} </span>
            <span class="user fst-italic text-success">${content.content} </span>
        `
        document.getElementById('messageBox').appendChild(msg)
    }
    if (Array.isArray(data)){
        for (message of data) {
            appendMessge(message)
        }
    }
    else {
        appendMessge(data)
    }
    

})

socket.on('refreshProds', (data) => {
    handleRenderer(data)
    console.log(data)
})