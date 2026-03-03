-- Database Create Script for cPanel phpMyAdmin

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `rating` decimal(3,1) NOT NULL DEFAULT '0.0',
  `review_count` int(11) NOT NULL DEFAULT '0',
  `image` varchar(500) NOT NULL,
  `is_prime` tinyint(1) NOT NULL DEFAULT '0',
  `category` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `products` (`id`, `title`, `price`, `rating`, `review_count`, `image`, `is_prime`, `category`, `description`) VALUES
(1, 'Apple iPhone 14 (128 GB) - Midnight', 69900, 4.5, 1234, 'https://m.media-amazon.com/images/I/61cwywTEOWL._AC_SL1500_.jpg', 1, 'Mobiles', 'The latest iPhone with advanced camera system and A15 Bionic chip.'),
(2, 'Samsung Galaxy M14 5G (Icy Silver, 6GB, 128GB)', 14990, 4.0, 567, 'https://m.media-amazon.com/images/I/817WWpaQQbL._AC_SL1500_.jpg', 1, 'Mobiles', '5G smartphone with massive 6000mAh battery.'),
(3, 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 29990, 4.8, 890, 'https://m.media-amazon.com/images/I/61+ElFx0vPL._AC_SL1500_.jpg', 1, 'Electronics', 'Industry leading noise cancellation with auto NC optimizer.'),
(4, 'Echo Dot (4th Gen) | Smart speaker with Alexa', 3499, 4.6, 3421, 'https://m.media-amazon.com/images/I/61MBWA8p50L._AC_SL1000_.jpg', 1, 'Electronics', 'Smart speaker with Alexa and premium sound.'),
(5, 'HP 15s, 11th Gen Intel Core i3, 8GB RAM/512GB SSD', 39990, 4.1, 450, 'https://m.media-amazon.com/images/I/71yzJoE7WlL._AC_SL1500_.jpg', 0, 'Computers', 'Thin and light laptop with micro-edge screen.'),
(6, 'American Tourister 32 Ltrs Black Casual Backpack', 1199, 4.2, 1200, 'https://m.media-amazon.com/images/I/81vJyb43URL._AC_SL1500_.jpg', 1, 'Fashion', 'Durable and spacious backpack for daily commuting.'),
(7, 'Philips HL7756/00 Mixer Grinder', 3899, 4.3, 2100, 'https://m.media-amazon.com/images/I/612a83jFv8L._AC_SL1158_.jpg', 1, 'Home', 'Powerful 750W motor for tough processing.');
