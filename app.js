// Instanciando o vue
const vm = new Vue({
    // Elemento em que será aplicado o vue. Corresponde a um elemento do html marcado com id
    el: '#app',
    // Dados que serão retornados para o html
    data: {
        produtos: [], // Lista de produto vindo do fetch
        produto: null, // produto específico
        //carrinhoTotal: 0, // total de itens no carrinho - removido e jogado para computed
        carrinho:[], // itens armazenados no carrinho
        mensagemAlerta: "Item adicionado", // Mensagem do alerta que é exibido no html
        // atributo que controla dinamicamente a exibição ou não da mensagem de alerta
        // inicia falso e ao ser chamada muda seu estado e adiciona a classe ativo no elemento
        // Quem modifica esse estado é o método alerta
        alertaAtivo: false,
        // Atributo para controlar se o modal está aberto ou fechado. 
        carrinhoAtivo: false
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
    // evita repetição de código js no html. carrinhoTotal reaproveitável em todo código
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
        // Método para fechar o modal do carrinho. 
        // É uma alternativa para fechar ao botão
        clickForaCarrinho({target, currentTarget }){
            if(target === currentTarget){
                this.carrinhoAtivo = false
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
            // chama método de alerta
            this.alerta(`${nome} adicionado ao carrinho`)
        },
        // Método para remover um item
        // Esse método deverá remover um item específico do carrinho. Para isso, será usado
        // em conjunto com o v-for para que cada item do carrinho possa ser chamado separadamente
        // e passar p.e. a sua posição do array para que seja eliminado e após isso, reicrementado no estoque
        removerItem(index){
            this.carrinho.splice(index,1)
        },
        // Checa o localStorage e atribui ao atributo carrinho
        // Ele deve ser chamado sempre que a instância do vue.js for criada
        // para isso, deve ficar dentro do Hook created
        checarLocalStorage(){
            // checa se há algo no localStorage
            if(window.localStorage.carrinho){
                // atribui ao atributo local carrinho o conteúdo
                // faz o parse para transformar string em objeto
                this.carrinho = JSON.parse(window.localStorage.carrinho)

            }
        }, 
        // Método que modifica o estado de alertaAtivo
        // pelo método adicionar item. Além disso, é modificado através do mesmo
        alerta(mensagem){
            this.mensagemAlerta = mensagem
            this.alertaAtivo = true
            // Resetando o alerta para false para deixar de ser exibido em 1,5 segundos
            setTimeout(() =>{
                this.alertaAtivo = false;
            }, 1500)
        },
        // criando um route para rotear as urls
        // Esse método é chamado sempre que a instância do vue.js for criada, ou seja, 
        // está contida no hook oncreate
        // Esse é um router bem básico.
        router(){
            // pega o hash da url
            const hash = document.location.hash;
            // Se o hash existir, faz o fetch do produto por id do dado que veio no hash
            if(hash){
                // usa o método de fetch de produto que aguarda um id como parâmetro
                // usamos o replace para trocar o # que vem no hash para nada e poder fazer o fetch
                this.fetchProduto(hash.replace("#", ""))
            }
        }
    },
    // Fica monitorando uma propriedade. Sempre que essa propriedade se modificar, pode-se atvar um código.
    // específico com alguma ação.
    watch:{
        // Monitoramento do carrinho de compras. Sempre que essa muda, salva no localStorage
        carrinho(){
            // salva informações no localStorage do navegador: 
            // Necessário transformar em string antes de salvar
            // O method "checarLocalStorage" recupera as informaçoes salvas em localStorage
            window.localStorage.carrinho = JSON.stringify(this.carrinho)
        },
        // Monitorando os produtos que estão sendo clicados: 
        // Sempre que produto se modifica, altera o route
        // função é mudar dados da página
        produto(){
            // Altera o título da página
            document.title = this.produto.nome || "Techno"
            // Altera a url da página
            const hash = this.produto.id || ""
            history.pushState(null,null, `#${hash}`)
        }
    },
    // Hooks: Partes do ciclo de vida da aplicação que são usados para chamar algum código
    created(){
        // Ao criar a aplicação chama o fetch da lista de produtos
        this.fetchProdutos();
        this.router();
        this.checarLocalStorage();
    }
})

