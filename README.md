# Baseroot

Bu proje, kullanıcıların akademik araştırmalarının hash'lerini Solana blockchain'ine gönderebileceği bir Solana akıllı sözleşmesidir. Akıllı sözleşme, araştırma hash'ini, sahibinin public key'ini ve araştırmanın gönderildiği zamanın timestamp'ini saklar.

## Akıllı Sözleşme Fonksiyonalitesi

Akıllı sözleşme aşağıdaki fonksiyonu sağlar:

- **`submit_research`**: Kullanıcının akademik araştırma hash'ini göndermesine olanak tanır. Bu fonksiyon, araştırma hash'ini, kullanıcının public key'ini (sahip olarak) ve mevcut zaman damgasını saklar.

---

## Projeyi Derlemek

Projeyi derlemek için Rust ve Anchor CLI'nin yüklü olması gerekmektedir. Bunları yükledikten sonra, projenin kök dizinine gidin ve aşağıdaki komutları çalıştırın:

### 1. Anchor Bağımlılıklarını Yüklemek

```bash
anchor install
```

### 2. Solana Test Ağı Başlatmak

Yerel geliştirme ortamını başlatmak için aşağıdaki komutu kullanın:

```bash
solana-test-validator
```

### 3. Akıllı Sözleşmeyi Derlemek

```bash
anchor build
```

### 4. Akıllı Sözleşmeyi Solana Ağına Dağıtmak

```bash
anchor deploy
```

---

## Dağıtım

Projede şu an için dağıtım işlemi yapılmamıştır. Bu nedenle akıllı sözleşme yalnızca yerel test ağı üzerinde çalıştırılabilir. Gerçek ağda dağıtım yapmak için, dağıtım ayarlarını ve cüzdan bilgilerinizi yapılandırmanız gerekecektir.

---

## Kullanıcı Rolleri

1. **Araştırmacılar**: 
   - Veri yükler, öneriler sunar.
2. **Topluluk**: 
   - Araştırma ve proje önerilerine oy verir, destekler.
3. **Doğrulayıcılar**: 
   - Araştırmaların geçerliliğini denetler (isteğe bağlı bir modül).

---

## Frontend Hazırlığı (Sonraki Adım)

Web3.js veya React + Solana Wallet Adapter kullanarak kullanıcı arayüzü oluşturulacaktır. Bu arayüz üzerinden kullanıcılar:

- Cüzdanlarını bağlayacaklar.
- Araştırmalarını yükleyecekler.
- DAO içerisinde oy kullanabilecekler.
