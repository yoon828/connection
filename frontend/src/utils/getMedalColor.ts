import GoldMedal from "../asset/img/Gold.svg";
import SilverMedal from "../asset/img/Silver.svg";
import BronzeMedal from "../asset/img/Bronze.svg";

const getMedalColor = (rank: number) => {
  if (rank === 1) return GoldMedal;
  if (rank === 2) return SilverMedal;
  return BronzeMedal;
};

export default getMedalColor;
