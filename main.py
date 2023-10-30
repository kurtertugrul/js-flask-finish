from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


from flask_cors import CORS




app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'  
db = SQLAlchemy(app)
CORS(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=False, nullable=False)
    surname = db.Column(db.String(20), unique=False, nullable=False)
    birthday = db.Column(db.String(20), unique=False, nullable=False)
    gender = db.Column(db.Integer, nullable=False)
    phonenumber = db.Column(db.String(15), unique=False, nullable=False)
    email = db.Column(db.String(40), unique=False, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    passwordcorrect= db.Column(db.String(120), nullable=False)

    

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    username = db.Column(db.Integer, db.ForeignKey('user.username'))
    


with app.app_context():
    db.create_all()
    

def get_gender_as_text(gender):
    if gender == 1:
        return "Erkek"
    elif gender == 2:
        return "Kadın"
    else:
        return "Bilinmiyor"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    surname = data.get('surname')
    birthday = data.get('birthday')
    gender = data.get('gender')
    phonenumber = data.get('phonenumber')
    email = data.get('email') 
    username = data.get('username')
    password = data.get('password')
    passwordcorrect = data.get('passwordcorrect')

    if not name or not surname or not birthday or not gender or not phonenumber or not email or not username or not password or not passwordcorrect:
        return jsonify({'error': 'Lütfen Bilgilerinizi Eksiksiz Bir Şekilde Girin '}), 400

    if password != passwordcorrect:
        return jsonify({'error': 'Şifreler uyuşmuyor. Lütfen aynı şifreyi ikinci kez girin.'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    hashed_password1 = bcrypt.generate_password_hash(passwordcorrect).decode('utf-8')
    
    new_user = User(name=name, surname=surname, birthday=birthday, gender=gender, phonenumber=phonenumber, email=email, username=username, password=hashed_password, passwordcorrect=hashed_password1)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Kullanıcı başarıyla kaydedildi'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Kullanıcı adı ve şifre gerekli'}), 400

    user = User.query.filter_by(username=username).first() # User tablosuna sorgu yapar ve  username ve password alanlarının username ve password degiskenlerine esit olan bir kullanıcıyı aramak icin kullanılır. first() ise bu sorguya ilk eslesen kaydı dondurur.
    

    if user and bcrypt.check_password_hash(user.password, password):
        return jsonify({'message': 'Giriş Yapıldı', 'status': True}), 200
    else:
        return jsonify({'error': 'Kullanıcı adı veya şifre hatalı', 'status': False}), 400
    
@app.route('/user_info', methods=['GET'])
def user_info():
    
    username = request.headers.get('username')
    
    if username is None:
        return jsonify({'error': 'Username not provided in headers'}), 400
    
    get_user = User.query.filter_by(username=username).all()
    
    if not get_user:
        return jsonify({'message': 'No user found for this username', 'status': False}), 404
    
    
    user_list = []
    for user in get_user:
        user_list.append({
            'id':user.id,
            'name': user.name,
            'surname': user.surname,
            'birthday': user.birthday,
            'gender': user.gender,
            'phonenumber': user.phonenumber,
            'email': user.email,
            'username': user.username
        })
    print(user_list)

    return jsonify({'data': user_list, 'status': True}), 200


# @app.route('/update_user', methods=['PUT'])
# def update_user():
#     data = request.get_json()
#     user_id = data.get('id')
#     name = data.get('name')
#     surname = data.get('surname')
#     birthday = data.get('birthday')
#     gender = data.get('gender')
#     phonenumber = data.get('phonenumber')
#     email = data.get('email')

#     if not user_id:
#         return jsonify({'error': 'Kullanıcı kimliği (id) eksik.'}), 400

#     # Kullanıcı kimliğini kullanarak ilgili kullanıcıyı veritabanından alın.
#     user = User.query.get(user_id)

#     if user:
#         # Yeni bilgileri güncelle.
#         if name:
#             user.name = name
#         if surname:
#             user.surname = surname
#         if birthday:
#             user.birthday = birthday
#         if gender:
#             user.gender = gender
#         if phonenumber:
#             user.phonenumber = phonenumber
#         if email:
#             user.email = email

#         db.session.commit()
#         return jsonify({'message': 'Kullanıcı bilgileri başarıyla güncellendi.'}), 200
#     else:
#         return jsonify({'error': 'Kullanıcı bulunamadı.'}), 404

    
    
    


@app.route('/new_post', methods=['POST'])
def create_post():
    
    
    auth = request.json.get('username')


    if auth is None:
        return jsonify({'error': 'Username not provided in headers'}), 400
    
    title = request.json.get('title')
    description = request.json.get('description')
    username = request.json.get('username') 
    print(username)
    new_post = Post(title=title, description=description, username=username)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Gönderi oluşturuldu!'})

@app.route('/update', methods=['PUT'])
def update_post():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    id = data.get('id')

    if not title or not description:
        return jsonify({'error': 'Title and description must be provided'}), 400

    post = Post.query.get(id)
    if post:
        post.title = title
        post.description = description
        db.session.commit()
        return jsonify({'message': 'Post successfully updated'}), 200
    else:
        return jsonify({'error': 'Post not found', 'status': False}), 404


@app.route('/get', methods=['GET'])
def new_post_get():
    username = request.headers.get('username')

  
# İstek başlıklarından kullanıcı adını alın
    if username is None:
        return jsonify({'error': 'Username not provided in headers'}), 400

   
# Kullanıcı adıyla ilişkili gönderileri almak için veritabanını sorgulayın
    posts = Post.query.filter_by(username=username).all()

  # Hiçbir gönderi bulunamazsa uygun bir yanıt gönderin
    if not posts:
        return jsonify({'message': 'No posts found for this username', 'status': False}), 404

   
# Gönderi sözlüklerinin bir listesini hazırlayın
    post_list = []
    for post in posts:
        post_list.append({
            'id': post.id,
            'title': post.title,
            'description': post.description,
            'username': post.username
            
        })
    print(post_list)

    
# Gönderilerin listesini JSON olarak döndür
    return jsonify({'data': post_list, 'status': True}), 200



@app.route('/all_post_get', methods=['GET'])
def all_post_get():
    posts = Post.query.all()
    post_list = []
    for post in posts:
        post_list.append({'id': post.id, 'title': post.title, 'description': post.description,  'username': post.username})

    return jsonify({'data': post_list, 'status': True}), 200




@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_post(id):
    post = Post.query.get(id)
    if post:
        db.session.delete(post)
        db.session.commit()
        return jsonify({'message': 'Post başarıyla silindi', 'status': True}), 200
    else:
        return jsonify({'error': 'Post bulunamadı', 'status': False}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
