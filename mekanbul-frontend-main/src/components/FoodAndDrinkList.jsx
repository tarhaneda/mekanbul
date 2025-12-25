const FoodAndDrinkList = ({ foodAndDrinkList }) => {
  return foodAndDrinkList.map((fan, index) => (
    <span key={index}>
      <span className="label label-warning"> {fan}</span>
      &nbsp;
    </span>
  ));
};
// nbsp=Non-Breaking Space' (Bölünemez Boşluk)

export default FoodAndDrinkList;
