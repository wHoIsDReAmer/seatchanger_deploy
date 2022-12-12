var user_data = {
  "2": {
    "name": "강민우"
  },

  "3": {
    "name": "김민정"
  },

  "4": {
    "name": "김성훈"
  },

  "5": {
    "name": "김주오"
  },

  "6": {
    "name": "김찬민"
  },

  "7": {
    "name": "노이환"
  },

  "8": {
    "name": "박태원"
  },
  "9": {
    "name": "서창현"
  },

  "10": {
    "name": "송준희"
  },

  "11": {
    "name": "이관호"
  },

  "12": {
    "name": "이상민"
  },
  "13": {
    "name": "이재우"
  },
  "14": {
    "name": "이찬욱"
  },
  "15": {
    "name": "이하은"
  },

  "16": {
    "name": "이혜승"
  },
  "17": {
    "name": "임현준"
  },

  "18": {
    "name": "전유찬"
  },

  "19": {
    "name": "전병우"
  },

  "01099890823": {
    "name": "선생님",
    "is_admin": true
  }
}

var user_seats = {};
for (let i = 1; i <= 18; i++)
    user_seats['' + i] = {};

var cookies = {};

module.exports = { cookies, user_seats, user_data };