const recipesEl = document.getElementById("recipes");
const favoritesEl = document.getElementById("favorites");
const generateBtn = document.getElementById("generateBtn");
const template = document.getElementById("recipeCardTemplate");

function loadFavorites() {
  return JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
}

function saveFavorites(list) {
  localStorage.setItem("favoriteRecipes", JSON.stringify(list));
}

function buildRecipes(ingredients) {
  const base = ingredients.slice(0, 5);
  const joined = base.join("と");
  return [
    {
      title: `${base[0] || "旬の食材"}のガーリック炒め`,
      summary: "短時間で作れる香ばしいメイン料理。",
      ingredients: base,
      steps: [
        "材料を食べやすく切る。",
        "フライパンでオリーブオイルとにんにくを温める。",
        `${joined}を順に炒め、塩こしょうで調える。`,
        "仕上げにバターを少量加えてコクを出す。"
      ]
    },
    {
      title: `${base[1] || "野菜"}たっぷりトマト煮`,
      summary: "作り置きにも向くやさしい味。",
      ingredients: [...base, "トマト缶", "コンソメ"],
      steps: [
        "鍋で玉ねぎを透き通るまで炒める。",
        "他の材料を加えて軽く炒める。",
        "トマト缶と水を入れて15分煮込む。",
        "塩で味を整え、ハーブを散らす。"
      ]
    },
    {
      title: `${base[2] || "チーズ"}の和風パスタ`,
      summary: "材料を無駄なく使える人気メニュー。",
      ingredients: [...base, "パスタ", "しょうゆ"],
      steps: [
        "パスタを表示時間より1分短くゆでる。",
        "具材を炒め、ゆで汁をお玉1杯加える。",
        "パスタとしょうゆを加えて和える。",
        "最後にチーズをのせて完成。"
      ]
    }
  ];
}

async function generateDishImage(recipeTitle, apiKey, model) {
  if (!apiKey) {
    return `https://source.unsplash.com/featured/?${encodeURIComponent(recipeTitle + ',food')}`;
  }

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      prompt: `A beautiful, realistic food photo of ${recipeTitle}, natural light, Japanese home cooking style`,
      size: "1024x1024"
    })
  });

  if (!res.ok) {
    throw new Error("画像生成に失敗しました");
  }

  const data = await res.json();
  return data.data?.[0]?.url || "";
}

function renderCard(recipe, onFavorite, isFavoriteView = false) {
  const clone = template.content.cloneNode(true);
  clone.querySelector(".recipe-title").textContent = recipe.title;
  clone.querySelector(".recipe-summary").textContent = recipe.summary;

  const img = clone.querySelector(".recipe-image");
  img.src = recipe.image;
  img.alt = `${recipe.title}の写真`;

  const ingUl = clone.querySelector(".recipe-ingredients");
  recipe.ingredients.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ingUl.appendChild(li);
  });

  const stepsOl = clone.querySelector(".recipe-steps");
  recipe.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    stepsOl.appendChild(li);
  });

  const favBtn = clone.querySelector(".favorite-btn");
  favBtn.textContent = isFavoriteView ? "♥ お気に入り済み" : "♡ お気に入りに追加";
  favBtn.onclick = () => onFavorite(recipe);
  return clone;
}

function renderFavorites() {
  const favorites = loadFavorites();
  favoritesEl.innerHTML = "";
  favorites.forEach(r => {
    favoritesEl.appendChild(renderCard(r, () => {}, true));
  });
}

generateBtn.addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredients").value
    .split(",")
    .map(i => i.trim())
    .filter(Boolean);

  if (!ingredients.length) {
    alert("材料を1つ以上入力してください。");
    return;
  }

  const apiKey = document.getElementById("apiKey").value.trim();
  const model = document.getElementById("imageModel").value.trim() || "images-2.0";

  generateBtn.disabled = true;
  generateBtn.textContent = "生成中...";
  recipesEl.innerHTML = "";

  try {
    const recipes = buildRecipes(ingredients);
    for (const recipe of recipes) {
      try {
        recipe.image = await generateDishImage(recipe.title, apiKey, model);
      } catch {
        recipe.image = `https://source.unsplash.com/featured/?${encodeURIComponent(recipe.title + ',dish')}`;
      }

      recipesEl.appendChild(
        renderCard(recipe, (picked) => {
          const favorites = loadFavorites();
          if (!favorites.some(f => f.title === picked.title)) {
            favorites.push(picked);
            saveFavorites(favorites);
            renderFavorites();
          }
        })
      );
    }
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "レシピを提案する";
  }
});

renderFavorites();
