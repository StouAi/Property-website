import random
import string

# Generate a random email ensuring uniqueness
def generate_random_email(f_name, l_name, existing_emails):
    email = f"{f_name.lower()}.{l_name.lower()}{random.randint(10, 99)}@gmail.com"
    while email in existing_emails:
        email = f"{f_name.lower()}.{l_name.lower()}{random.randint(10, 99)}@gmail.com"
    existing_emails.add(email)
    return email

# Generate a random phone number ensuring uniqueness
def generate_random_phone(existing_phones):
    phone = f"69{random.randint(10000000, 99999999)}"
    while phone in existing_phones:
        phone = f"69{random.randint(10000000, 99999999)}"
    existing_phones.add(phone)
    return phone

# Generate a random password
def generate_random_password(length):
    characters = string.ascii_letters + string.digits + '!@#$%^&*()'
    return ''.join(random.choice(characters) for _ in range(length))

# Generate users with unique emails and phone numbers
def generate_users(num_users):
    f_names = ['John', 'Jane', 'Jack', 'Jill', 'James', 'Jenny', 'Jared', 'Jasmine', 'Jasper', 'Jade', 'Giorgos', 'Nektaria',
               'Nikos', 'Maria', 'Kostas', 'Dimitris', 'Eleni', 'Vasilis', 'Vasiliki', 'Vaggelis', 'Kostantinos', 'Anastasis',
               'Anastasia', 'Eirini', 'Alexandros', 'Alexandra', 'Alex', 'Alexa', 'Alexia', 'Yolanda', 'Takis']
    l_names = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Papachristou', 'Papadopoulos', 'Papadakis', 'Papageorgiou',
               'Papadopoulou', 'Zevgoula', 'Tsampras', 'Tsamprakos', 'Tsamprinos', 'Papoutsas', 'Moustakas', 'Sintoris', 'Avouris',
               'Palaiologos', 'Papadimitriou', 'Satti', 'Ntagkas']

    existing_emails = set()
    existing_phones = set()
    users = []

    for _ in range(num_users):
        f_name = random.choice(f_names)
        l_name = random.choice(l_names)

        user = {
            "username": generate_random_email(f_name, l_name, existing_emails),
            "password": generate_random_password(10),
            "first_name": f_name,
            "last_name": l_name,
            "phone": generate_random_phone(existing_phones)
        }
        users.append(user)

    return users

# Generate locations
def generate_locations(num_locations):
    cities = ['Athens', 'Thessaloniki', 'Patra', 'Larisa', 'Heraklion', 'Ioannina', 'Kavala', 'Kalamata', 'Kozani', 'Kilkis',
              'Korinthos', 'Karditsa', 'Edessa', 'Alexandroupoli', 'Amfissa', 'Argos', 'Arta', 'Grevena', 'Drama']

    neighborhoods = ['Kolonaki', 'Kifisia', 'Glyfada', 'Nea Smyrni', 'Palaio Faliro',
                     'Marousi', 'Voula', 'Vouliagmeni', 'Vrilissia', 'Pefki', 'Agia Paraskevi', 'Aroi', 'Ampelokipoi',
                     'Ano Patissia', 'Ano Glyfada', 'Ano Liosia', 'Maizonos', 'Makrygianni', 'Makrigi', 'Omonia',
                     'Omonoia', 'Agia Varvara', 'Agia Marina', 'Agia Triada', 'Agia Trias', 'Agia Sofia', 'Kanakari',
                     'Tsimiski', 'Toumba', 'Kalamaria', 'Kato Toumba', 'Kato Kalamaria', 'Kato Polemidia', 'Zalokosta',
                     'Zefyri', 'Zografou', 'Zoodochos Pigi', 'Nikitara']

    zips = [str(random.randint(10000, 99999)) for _ in neighborhoods]

    locations = set()
    while len(locations) < num_locations:
        idx = random.randint(0, len(neighborhoods) - 1)
        location = {
            "country": "Greece",
            "city": random.choice(cities),
            "zip": zips[idx],
            "neighborhood": neighborhoods[idx]
        }
        locations.add((location['country'], location['city'], location['zip'], location['neighborhood']))

    return [dict(zip(('city', 'zip', 'neighborhood'), loc)) for loc in locations]

# Generate properties
def generate_properties(num_properties, users, locations):
    types = ["Residential", "Commercial", "Land"]
    res_subtypes = ['Apartment', 'Studio', 'Maisonette', 'Detached house']
    com_subtypes = ['Office', 'Store', 'Warehouse']
    properties = []
    streets = ['Ermou', 'Stadiou', 'Akadimias', 'Patission', 'Syngrou',
               'Kifisias', 'Vasilissis Sofias', 'Amalias', 'Panepistimiou', 'Peiraios',
               'Leoforos Alexandras', 'Leoforos Vouliagmenis', 'Leoforos Kifisias',
               'Leoforos Syngrou', 'Leoforos Poseidonos', 'Leoforos Vasileos Konstantinou',
               'Leoforos Vasileos Georgiou', 'Leoforos Vasileos Pavlou',
               'Leoforos Vasileos Alexandrou', 'Leoforos El Venizelou', 'Solonos',
               'Themistokleous', 'Ippokratous', 'Sokratous', 'Perikleous', 'Herodotou',
               'Thucydides', 'Platonos', 'Aristotelous', 'Socratous', 'Xenophonos',
               'Epicurou', 'Zinonos', 'Pindarou', 'Aeschylou', 'Sophocleous', 'Euripidou',
               'Demosthenous', 'Isokratous', 'Lysias', 'Andokides', 'Antiphon',
               'Aeschines', 'Lycurgus', 'Dinarchus', 'Hypereides']
    numbers = list(range(1, 301))  # Numbers from 1 to 300

    for _ in range(num_properties):
        type_ = random.choice(types)
        street = random.choice(streets)
        number = random.choice(numbers)
        address = f"{street} {number}"
        for_rent = random.choice([0, 1])

        price = random.randint(4, 80) * 50 if for_rent else random.randint(2, 480) * 1000

        property_ = {
            "type": type_,
            "address": address,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "surface": random.randint(25, 1000),
            "price": price,
            "constructionYear": random.randint(1950, 2025),
            "forRent": for_rent
        }

        if type_ == "Residential":
            property_.update({
                "subtype": random.choice(res_subtypes),
                "floor": random.randint(0, 8),
                "levels": random.randint(1, 3),
                "bedrooms": random.randint(1, 5),
                "bathrooms": random.randint(1, 3)
            })

        elif type_ == "Commercial":
            property_.update({
                "subtype": random.choice(com_subtypes),
                "floor": random.randint(0, 12),
                "levels": random.randint(1, 5),
                "bathrooms": random.randint(1, 6),
                "parking": random.choice([0, 1])
            })

        elif type_ == "Land":
            property_.update({
                "buildable": random.choice([0, 1])
            })

        user_id = random.randint(0, len(users) - 1)
        location = random.choice(locations)
        properties.append((user_id, property_, location))

    return properties

def fill_data():
    num_users = 10
    num_locations = 10
    num_properties = 10

    users = generate_users(num_users)
    locations = generate_locations(num_locations)
    properties = generate_properties(num_properties, users, locations)

    # Simulating database inserts with print statements
    print('Users:')
    for user in users:
        print(user)

    print('Locations:')
    for location in locations:
        print(location)

    print('Properties:')
    for property_ in properties:
        print(property_)

fill_data()