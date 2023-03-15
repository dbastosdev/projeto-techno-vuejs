// Instanciando o vue
const vm = new Vue({
    // Elemento em que será aplicado o vue. Corresponde a um elemento do html marcado com id
    el: '#app',
    // Dados que serão retornados para o html
    data: {
        produtos: [], // Lista de produto vindo do fetch
        produto: null // produto específico
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
        // Acionado via hook
        fetchProdutos(){
            // fetch realizado de fato e seus métodos concatenados
            fetch("./api/produtos.json")
            .then(r => r.json())
            .then(r => {
                this.produtos = r
            })
        },
        // Método para buscar dados de um produto
        // Acionamento deste fetch é realizado via @click
        fetchProduto(id){
            fetch(`./api/produtos/${id}/dados.json`)
            .then(r => r.json())
            .then(r => {
                this.produto = r
            })
        }
    },
    // Hooks: Partes do ciclo de vida da aplicação que são usados para chamar algum código
    created(){
        // Ao criar a aplicação chama o fetch da lista de produtos
        this.fetchProdutos();
    }
})

