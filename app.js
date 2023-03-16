// Instanciando o vue
const vm = new Vue({
    // Elemento em que será aplicado o vue. Corresponde a um elemento do html marcado com id
    el: '#app',
    // Dados que serão retornados para o html
    data: {
        produtos: [], // Lista de produto vindo do fetch
        produto: null, // produto específico
        //carrinhoTotal: 0, // total de itens no carrinho - removido e jogado para computed
        carrinho:[] // itens armazenados no carrinho
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
    // Para cálculos com as variáveis do javascript. É representado por métodos
    // Reduz a carga de processamento da apresentação ao retornar diretamente o valor computado para camada de apresentação
    // Esse computed é reativo. Sempre que os 'datas' mudarem será calculado um valor e será exibido na tela o valor atualizado
    computed:{
        // carrinho total será calculado aqui e passado para o front como um item de 'data'
        carrinhoTotal(){
            // lógica para soma dos produtos no carrinho
            let total = 0;
            if(this.carrinho.length){
                this.carrinho.forEach(item => {
                    total += item.preco // total não precisa de this pois é local
                });
            }
            return total
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
        // Acionamento deste fetch é realizado via método abrir modal
        fetchProduto(id){
            fetch(`./api/produtos/${id}/dados.json`)
            .then(r => r.json())
            .then(r => {
                this.produto = r
            })
        },
        abrirModal(id){
            // aciona o método fetchProduto para abrir o modal passando-o o id recebido do html
            this.fetchProduto(id);
            /* faz um scroll para o topo da página*/
            window.scrollTo({
                top: 0, 
                /* efeito do scroll para ficar mais suave*/
                behavior: "smooth"
            })
        },
        // Método para fechar o modal ao clicar fora dele na parte escura. 
        // É uma alternativa para fechar ao botão
        // Esta desestruturando o evento no target = aquilo que está sendo clicado - elemento
        // e o currentTarget onde está sendo ouvido, no caso onde está o @click
        fecharModal({target, currentTarget }){
            if(target === currentTarget){
                this.produto = false
            }
        },
        // método para adicionar item no array this.carrinho e incrementar o this.carrinhoTotal
        // Além disso, quando o item for adicionado ao carrinho, deve-se remover uma unidade do estoque
        // Será chamado no botão dentro do modal de adicionar item
        adicionarItem(){
            // remove unidade do estoque de um produto específico já aberto no modal ao click
            this.produto.estoque--; 
            // Adiciona item ao carrinho
                // desestrutura o objeto
            const {id, nome, preco} = this.produto
                // adiciona o objeto desestruturado dentro do carrinho
            this.carrinho.push({id, nome, preco})
        },
        // Método para remover um item
        // Esse método deverá remover um item específico do carrinho. Para isso, será usado
        // em conjunto com o v-for para que cada item do carrinho possa ser chamado separadamente
        // e passar p.e. a sua posição do array para que seja eliminado e após isso, reicrementado no estoque
        removerItem(index){
            this.carrinho.splice(index,1)
        }
    },
    // Hooks: Partes do ciclo de vida da aplicação que são usados para chamar algum código
    created(){
        // Ao criar a aplicação chama o fetch da lista de produtos
        this.fetchProdutos();
    }
})

