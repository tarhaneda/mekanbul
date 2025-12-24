// Gerekli bileşenleri ve kütüphaneleri içe aktar
import Header from "./Header"; // Sayfa başlığı bileşeni
import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; // Router hook'ları
import VenueDataService from "../services/VenueDataService"; // API servisi
import { useDispatch } from "react-redux"; // Redux state yönetimi

// Yorum ekleme sayfası bileşeni
function AddComment() {
  // URL'den mekan ID'sini al (örn: /venue/123/comment/new -> id = 123)
  const { id } = useParams();

  // Bir önceki sayfadan gelen bilgiyi almak için kullanılır (mekan adı vb.)
  const location = useLocation();

  // Redux kullanımı - State'i güncellemek için
  const dispatch = useDispatch();

  // Sayfa yönlendirme işlemleri için kullanılır
  const navigate = useNavigate();

  // Form gönderildiğinde çalışan fonksiyon
  const user = JSON.parse(localStorage.getItem("user"));

  const onSubmit = (evt) => {
    evt.preventDefault();

    if (!user || !user.token) {
      navigate("/login");
      return;
    }

    if (evt.target.elements.text.value &&
      evt.target.elements.rating.value) {
      let newComment = {
        author: user.name,
        text: evt.target.elements.text.value,
        rating: evt.target.elements.rating.value
      }
      VenueDataService.addComment(id, newComment, user.token).then(() => {
        dispatch({ type: "ADD_COMMENT_SUCCESS" });
        navigate("/venue/" + id);
      }).catch(() => {
        dispatch({ type: "FETCH_FAILURE" });
      });
    }
  };


  return (
    <>
      {/* Sayfa başlığı - Önceki sayfadan gelen mekan adını göster */}
      <Header headerText={location.state.name} motto=" mekanına yorum yap" />

      <div className="row">
        <div className="col-xs-12 col-md-6">
          {/* Yorum ekleme formu */}
          <form
            className="form-horizontal"
            id="yorumEkle"
            onSubmit={(evt) => onSubmit(evt)}
          >
            {/* İsim alanı (Otomatik doldurulur) */}
            <div className="form-group">
              <label className="col-sm-2 control-label">İsim:</label>
              <div className="col-sm-10">
                <input type="text"
                  className="form-control"
                  id="author"
                  name="author"
                  value={user ? user.name : ""}
                  disabled
                />
              </div>
            </div>

            {/* Puan seçimi (1-5 arası) */}
            <div className="form-group">
              <label className="col-xs-10 col-sm-2 control-label">
                Puan:
              </label>
              <div className="col-xs-12 col-sm-2">
                <select
                  className="form-control input-sm"
                  id="rating"
                  name="rating"
                >
                  <option>5</option>
                  <option>4</option>
                  <option>3</option>
                  <option>2</option>
                  <option>1</option>
                </select>
              </div>
            </div>

            {/* Yorum metni alanı */}
            <div className="form-group">
              <label className="col-sm-2 control-label">Yorum:</label>
              <div className="col-sm-10">
                <textarea
                  className="review form-control"
                  name="text"
                  rows={5}
                />
              </div>
            </div>

            {/* Form gönderme butonu */}
            <button className="btn btn-default pull-right">Yorum Ekle</button>
          </form>
        </div>

      </div>
    </>
  );
}

// Bileşeni dışa aktar
export default AddComment;
