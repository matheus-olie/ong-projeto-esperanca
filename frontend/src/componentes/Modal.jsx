function Modal({ titulo, children, aoFechar }) {
    return (
        <div className="fundo-modal">

            <div className="modal">

                <div className="cabecalho-modal">

                    <h2>{titulo}</h2>

                    <button
                        onClick={aoFechar}
                        className="fechar-modal"
                    >
                        ✕
                    </button>

                </div>

                <div className="conteudo-modal">
                    {children}
                </div>

            </div>

        </div>
    );
}

export default Modal;