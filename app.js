// Instanciando o vue
const vm = new Vue({
    // Elemento em que será aplicado o vue. Corresponde a um elemento do html marcado com id
    el: '#app',
    // Dados que serão retornados para o html
    data: {
        produtos: []

    },
    // Criando filtros da aplicação front end: 
    filters: {
        // Máscara de preços
        numeroPreco(valor){
            // return `R$${valor},00` - forma bruta
            // forma adequada - necessário jogar esse filtro no html
            return valor.toLocaleString("pt-BR", {style:"currency", currency:"BRL"})
        }
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

