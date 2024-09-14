//  True é verdade sempre, temos que ter um "return" para interromper o laço

const { select, input, checkbox } = require('@inquirer/prompts');


const fs = require("fs").promises

let mensagem = "Bem vindo ao app de metas!";

let metas 

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas =  JSON.parse(dados)
    }catch(erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}


const cadastraMetas = async () => {
    const meta = await input({message:"Digite a meta: "})

    if (meta.length == 0){
        mensagem = "A meta não pode ser vazia!"
        return
    }

    metas.push(
    {   value: meta,
        checked: false,
    })

    mensagem = "Meta cadastrada com sucesso"
}

const listarMetas = async () => {
    if(metas.length == 0) {
        return
    }

    const respostas = await checkbox ({
        message: "Use as setas para mudar de meta, o espaço para marca e desmarca e o Enter para finalizar a etapa.",
        choices:[...metas]
    })

    metas.forEach((m) =>{
        m.checked = false
        }
    )

    if ( respostas.length == 0){
        mensagem ="Nenhuma meta selecionada!"
        return
    }

    

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = "Meta(s) marcadas como concluída(s)"
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0){
        console.log("Não existe metas realizadas :(")
        return
    }

    await select({
        message: "Metas realizadas " + realizadas.length,
        choices:[...realizadas]
    })

    console.log(realizadas)

}

const metasnaoRealizadas = async ()  => {
    if(metas.length == 0) {
        return
    }
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length == 0){
        mensagem = "Não existe metas abertas :)"
        return
    }

    await select({
        message: "Metas abertas " + abertas.length,
        choices:[...abertas]

    })
}

const deletarMetas = async () => {
    if(metas.length == 0) {
        return
    }
    const metasDesmarcadas = metas.map((meta) => {
        meta.checked = false
        return meta
    })

    const itensADeletar = await checkbox ({
        message: "Seleciona um item para deletar!",
        choices:[...metasDesmarcadas],
        instructions: false
    })

    if(itensADeletar.length == 0){
        mensagem = "Nenhum item a deletar :)" 
    }

    itensADeletar.forEach((item) =>{
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Metas deletadas com sucesso!"
}

const mostrarMensagem = () => {
    console.clear()

    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()

    while(true){
        mostrarMensagem()
        await salvarMetas()
        
        const opcao = await select({
            message: "Menu ->",
            choices: [
            {
                name: "Cadastra meta",
                value: "cadastrar",
            },
            {
                name: "Listar metas",
                value: "listar",
            },
            {
                name: "Metas realizadas",
                value: "realizadas",
            },
            {
                name: "Metas não realizadas",
                value: "abertas",
            },
            {
                name: "Deletar metas",
                value: "deletar",
            },
            {
                name: "Sair",
                value: "sair",
            },
            ]

            
        });

        switch (opcao) {
            case "cadastrar":
                    await cadastraMetas()       
                break;
            
            case "listar":
                await listarMetas()               
                break;

            case "realizadas":
                await metasRealizadas()
                break;

            case "abertas":
                await metasnaoRealizadas()
                break;
            
            case "deletar":
                await deletarMetas()                
                break;
            
            case "sair" : 
                mensagem = "Até a proxima!"
                return
            //Ctrl + C -> Para o loop infinito
        }
        
    }
}

start()

/**/ 