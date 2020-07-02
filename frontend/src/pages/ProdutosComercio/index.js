import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { MdReply, MdFavorite } from "react-icons/md";
import { connect } from "react-redux";
import M from "materialize-css/dist/js/materialize.min.js";
import api from "../../services/Api";

import Card from "../../components/Card";
import Button from "../../components/Button";

import "./styles.css";

const ProdutosComercio = ({ user }) => {
  const [filtro, setFiltro] = useState("");
  const [categoriaSelecionada, setcategoriaSelecionada] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const { idComercio } = useParams();
  const { goBack } = useHistory();

  useEffect(() => {
    (async function () {
      let urlFiltro = "";
      urlFiltro += !!filtro ? `&nome=${filtro}` : "";
      urlFiltro += !!categoriaSelecionada
        ? `&idCategoria=${categoriaSelecionada}`
        : "";

      const [dataProdutos, dataCategorias] = await Promise.all([
        api.get(`/produtos?idComercio=${idComercio}${urlFiltro}`),
        api.get("/categorias"),
      ]);

      setCategorias(dataCategorias.data);
      setProdutos(dataProdutos.data);

      const elems = document.querySelectorAll("select");
      M.FormSelect.init(elems, {});
    })();
  }, [idComercio, filtro, categoriaSelecionada]);

  return (
    <>
      <div className="container-btn-voltar">
        <form className="form-filtros">
          <div className="input-field">
            <label htmlFor="filtro">Pesquisar pelo nome de um produto</label>
            <input
              type="text"
              nome="filtro"
              className="input-filtro"
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
              }}
            />
          </div>
          <div className="input-field div-select-filtro">
            <select
              value={categoriaSelecionada}
              onChange={(e) => setcategoriaSelecionada(e.target.value)}
            >
              <option value={0}>Filtrar por uma categoria</option>

              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>
          <Button
            text="VOLTAR"
            typeButton="secundaria"
            Icon={MdReply}
            onClick={(e) => {
              e.preventDefault();
              goBack();
            }}
          />
        </form>
        {Object.keys(user).length !== 0 && user.comercio === undefined && (
          <div className="div-add-favoritos-comercio">
            <Button
              Icon={MdFavorite}
              text="Adicionar aos favoritos"
              className="btn-add-favoritos"
            />
          </div>
        )}
      </div>

      <div className="container-comercios">
        {produtos.map((produto) => (
          <Card
            key={produto.id}
            id={produto.id}
            titulo={produto.nome}
            url={produto.url}
            descricao={produto.descricao}
            produto={{ preco: produto.preco }}
          />
        ))}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({ user: state.user });

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ProdutosComercio);
