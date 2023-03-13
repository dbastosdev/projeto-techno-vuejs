// Instanciando o vue
const vm = new Vue({
    // Elemento em que será aplicado o vue. Corresponde a um elemento do html marcado com id
    el: '#app',
    // Dados que serão retornados para o html
    data: {
        produtos: []

    },
    // Métodos com alguma ação na aplicação
    methods: {
        // método para buscar dados externos - local ou via api
        fetchProdutos(){
            // fetch realizado de fato e seus métodos concatenados
            fetch("./api/produtos.json")
            .then(r => r.json())
            .then(r => {
                this.produtos = r
            })
        }
    },
    // Hooks: Partes do ciclo de vida da aplicação que são usados para chamar algum código
    created(){
        this.fetchProdutos();
    }
})

