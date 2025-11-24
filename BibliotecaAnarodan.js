let usuarios = [];
let livros = [];
let emprestimos = [];

function init() {
    carregarDados();
    atualizarEstatisticas();
    renderizarUsuarios();
    renderizarLivros();
    renderizarEmprestimos();
    atualizarSelects();
}

function carregarDados() {
    usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    livros = JSON.parse(localStorage.getItem('livros') || '[]');
    emprestimos = JSON.parse(localStorage.getItem('emprestimos') || '[]');
}

function salvarDados() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('livros', JSON.stringify(livros));
    localStorage.setItem('emprestimos', JSON.stringify(emprestimos));
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
    
    if (sectionId === 'home') atualizarEstatisticas();
    if (sectionId === 'emprestimos') atualizarSelects();
}

function atualizarEstatisticas() {
    document.getElementById('totalUsuarios').textContent = usuarios.length;
    document.getElementById('totalLivros').textContent = livros.length;
    document.getElementById('totalEmprestimos').textContent = 
        emprestimos.filter(e => e.status === 'ativo').length;
}

function salvarUsuario(event) {
    event.preventDefault();
    
    const id = document.getElementById('usuarioId').value;
    const codigo = document.getElementById('usuarioCodigo').value.trim();
    const nome = document.getElementById('usuarioNome').value.trim();
    const email = document.getElementById('usuarioEmail').value.trim();

    if (!codigo || !nome || !email) {
        showSnackbar('Preencha todos os campos obrigatórios!', 'error');
        return;
    }

    const isDuplicado = livros.some(l => 
        l.codigo === codigo && (id ? l.id !== id : true)
    );
    if (isDuplicado) {
        showSnackbar(`O ID de Usuário "${codigo}" já está cadastrado!`, 'error');
        return;
    }

    if (id) {
        const usuario = usuarios.find(u => u.id === id);
        usuario.codigo = codigo;
        usuario.nome = nome;
        usuario.email = email;
        showSnackbar('Usuário editado com sucesso!', 'success');
    } else {
        usuarios.push({
            id: Date.now().toString(),
            codigo,
            nome,
            email
        });
        showSnackbar('Usuário cadastrado com sucesso!', 'success');
    }

    salvarDados();
    renderizarUsuarios();
    atualizarEstatisticas();
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
}

function editarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    document.getElementById('usuarioId').value = usuario.id;
    document.getElementById('usuarioCodigo').value = usuario.codigo;
    document.getElementById('usuarioNome').value = usuario.nome;
    document.getElementById('usuarioEmail').value = usuario.email;
}

function excluirUsuario(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    const temEmprestimos = emprestimos.some(e => e.usuarioId === id && e.status === 'ativo');
    if (temEmprestimos) {
        showSnackbar('Não é possível excluir usuário com empréstimos ativos!', 'error');
        return;
    }

    usuarios = usuarios.filter(u => u.id !== id);
    showSnackbar('Usuário excluído com sucesso!', 'success');
    salvarDados();
    renderizarUsuarios();
    atualizarEstatisticas();
}

function cancelarEdicaoUsuario() {
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
}

function renderizarUsuarios() {
    const container = document.getElementById('listaUsuarios');
    
    if (usuarios.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Nenhum usuário cadastrado</h3><p>Cadastre o primeiro usuário usando o formulário acima.</p></div>';
        return;
    }

    const html = `
        <table>
            <thead>
                <tr>
                    <th>Codigo</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${usuarios.map(u => `
                    <tr>
                        <td>${u.codigo}</td>
                        <td>${u.nome}</td>
                        <td>${u.email}</td>
                        <td>
                            <button class="btn btn-warning" onclick="editarUsuario('${u.id}')">Editar</button>
                            <button class="btn btn-danger" onclick="excluirUsuario('${u.id}')">Excluir</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

function salvarLivro(event) {
    event.preventDefault();
    
    const id = document.getElementById('livroId').value;
    const codigo = document.getElementById('livroCodigo').value.trim();
    const titulo = document.getElementById('livroTitulo').value.trim();
    const autor = document.getElementById('livroAutor').value.trim();
    const ano = document.getElementById('livroAno').value;
    const genero = document.getElementById('livroGenero').value.trim();
    const capa = document.getElementById('livroCapa').value.trim();
    const sinopse = document.getElementById('livroSinopse').value.trim();

    if (!codigo || !titulo || !autor || !ano || !genero) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const isDuplicado = livros.some(l => 
        l.codigo === codigo && (id ? l.id !== id : true)
    );
    if (isDuplicado) {
        showSnackbar(`O ID de Livro "${codigo}" já está cadastrado!`, 'error');
        return;
    }

    if (id) {
        const livro = livros.find(l => l.id === id);
        livro.codigo = codigo;
        livro.titulo = titulo;
        livro.autor = autor;
        livro.ano = ano;
        livro.genero = genero;
        livro.capa = capa; 
        livro.sinopse = sinopse;
    } else {
        livros.push({
            id: Date.now().toString(),
            codigo,
            titulo,
            autor,
            ano,
            genero,
            capa, 
            sinopse,
            status: true
        });
    }

    salvarDados();
    renderizarLivros();
    atualizarEstatisticas();
    document.getElementById('formLivro').reset();
    document.getElementById('livroId').value = '';
}

function editarLivro(id) {
    const livro = livros.find(l => l.id === id);
    document.getElementById('livroId').value = livro.id;
    document.getElementById('livroCodigo').value = livro.codigo;
    document.getElementById('livroTitulo').value = livro.titulo;
    document.getElementById('livroAutor').value = livro.autor;
    document.getElementById('livroAno').value = livro.ano;
    document.getElementById('livroGenero').value = livro.genero;
    document.getElementById('livroCapa').value = livro.capa || ''; 
    document.getElementById('livroSinopse').value = livro.sinopse || '';
}

function excluirLivro(id) {
    if (!confirm('Tem certeza que deseja excluir este livro?')) return;
    
    const temEmprestimos = emprestimos.some(e => e.livroId === id && e.status === 'ativo');
    if (temEmprestimos) {
        alert('Não é possível excluir livro que está emprestado!');
        return;
    }

    livros = livros.filter(l => l.id !== id);
    salvarDados();
    renderizarLivros();
    atualizarEstatisticas();
}

function cancelarEdicaoLivro() {
    document.getElementById('formLivro').reset();
    document.getElementById('livroId').value = '';
}

function mostrarSinopse(id) {
    const livro = livros.find(l => l.id === id);
    if (!livro || !livro.sinopse) {
        alert('Sinopse não disponível para este livro.');
        return;
    }

    const modal = document.getElementById('sinopseModal');
    const modalConteudo = document.getElementById('sinopseConteudo');

    modalConteudo.innerHTML = `
        <h3>Sinopse de: ${livro.titulo}</h3>
        <p>${livro.sinopse}</p>
    `;

    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('sinopseModal').style.display = 'none';
}

function renderizarLivros() {
    const container = document.getElementById('listaLivros');
    
    if (livros.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Nenhum livro cadastrado</h3><p>Cadastre o primeiro livro usando o formulário acima.</p></div>';
        return;
    }

    const html = `
        <table>
            <thead>
                <tr>
                    <th>Codigo</th>
                    <th>Capa</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Ano</th>
                    <th>Gênero</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${livros.map(l => `
                    <tr>
                        <td>${l.codigo}</td>
                        <td>
                            ${l.capa ? 
                                `<img src="${l.capa}" alt="Capa" class="livro-capa-miniatura">` : 
                                '-'
                            }
                        </td>
                        <td>${l.titulo}</td>
                        <td>${l.autor}</td>
                        <td>${l.ano}</td>
                        <td>${l.genero}</td>
                        <td>
                            <span class="badge ${l.status ? 'badge-success' : 'badge-danger'}">
                                ${l.status ? 'Disponível' : 'Emprestado'}
                            </span>
                        </td>
                        <td>
                            ${l.sinopse ? 
                                `<button class="btn btn-secondary btn-sm" onclick="mostrarSinopse('${l.id}')">Ver Sinopse</button>` : 
                                ''
                            }
                            <button class="btn btn-warning" onclick="editarLivro('${l.id}')">Editar</button>
                            <button class="btn btn-danger" onclick="excluirLivro('${l.id}')">Excluir</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

function atualizarSelects() {
    const selectUsuario = document.getElementById('emprestimoUsuario');
    const selectLivro = document.getElementById('emprestimoLivro');

    selectUsuario.innerHTML = '<option value="">Selecione um usuário</option>' +
        usuarios.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');

    const livrosDisponiveis = livros.filter(l => l.status);
    selectLivro.innerHTML = '<option value="">Selecione um livro</option>' +
        livrosDisponiveis.map(l => `<option value="${l.id}">${l.titulo} - ${l.autor}</option>`).join('');
}

function salvarEmprestimo(event) {
    event.preventDefault();
    
    const usuarioId = document.getElementById('emprestimoUsuario').value;
    const livroId = document.getElementById('emprestimoLivro').value;

    if (!usuarioId || !livroId) {
        alert('Selecione um usuário e um livro!');
        return;
    }

    const livro = livros.find(l => l.id === livroId);
    if (!livro.status) {
        alert('Este livro não está disponível!');
        return;
    }

    emprestimos.push({
        id: Date.now().toString(),
        usuarioId,
        livroId,
        dataEmprestimo: new Date().toLocaleDateString('pt-BR'),
        status: 'ativo'
    });

    livro.status = false;

    salvarDados();
    renderizarEmprestimos();
    renderizarLivros();
    atualizarEstatisticas();
    atualizarSelects();
    document.getElementById('formEmprestimo').reset();
}

function devolverLivro(id) {
    if (!confirm('Confirmar devolução do livro?')) return;

    const emprestimo = emprestimos.find(e => e.id === id);
    emprestimo.status = 'devolvido';
    emprestimo.dataDevolucao = new Date().toLocaleDateString('pt-BR');

    const livro = livros.find(l => l.id === emprestimo.livroId);
    livro.status = true;

    salvarDados();
    renderizarEmprestimos();
    renderizarLivros();
    atualizarEstatisticas();
    atualizarSelects();
    showSnackbar('Devolução registrada com sucesso!', 'success');
}

function renderizarEmprestimos() {
    const container = document.getElementById('listaEmprestimos');
    
    if (emprestimos.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Nenhum empréstimo registrado</h3><p>Registre o primeiro empréstimo usando o formulário acima.</p></div>';
        return;
    }

    const html = `
        <table>
            <thead>
                <tr>
                    <th>Usuário (Código)</th>
                    <th>Livro (Código)</th>
                    <th>Data Empréstimo</th>
                    <th>Data Devolução</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${emprestimos.map(e => {
                    const usuario = usuarios.find(u => u.id === e.usuarioId);
                    const livro = livros.find(l => l.id === e.livroId);
                    const usuarioInfo = usuario ? `${usuario.nome} (${usuario.codigo})` : 'Usuário removido';
                    const livroInfo = livro ? `${livro.titulo} (${livro.codigo})` : 'Livro removido';

                    return`
                        <tr>
                            <td>${usuarioInfo}</td> <td>${livroInfo}</td> <td>${e.dataEmprestimo}</td>
                            <td>${e.dataDevolucao || '-'}</td>
                            <td>
                                <span class="badge ${e.status === 'ativo' ? 'badge-warning' : 'badge-success'}">
                                    ${e.status === 'ativo' ? 'Ativo' : 'Devolvido'}
                                </span>
                            </td>
                            <td>
                                ${e.status === 'ativo' ? 
                                    `<button class="btn btn-success" onclick="devolverLivro('${e.id}')">Devolver</button>` : 
                                    '-'
                                }
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

function showSnackbar(message, type = 'success') {
    const snackbar = document.getElementById('snackbar');
    snackbar.textContent = message;
    
    snackbar.classList.remove('success', 'error');
    snackbar.classList.add(type);

    snackbar.classList.add('show');

    setTimeout(function(){ 
        snackbar.classList.remove('show'); 
    }, 3000);
}

init();