-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 06, 2020 at 12:18 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacationsdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `AdminID` int(11) NOT NULL,
  `Username` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `LoggedIn` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`AdminID`, `Username`, `Password`, `LoggedIn`) VALUES
(3, 'Admin', '93ae1a8a09b9112e606110c4df624bef6132c7b0', 0);

-- --------------------------------------------------------

--
-- Table structure for table `followed`
--

CREATE TABLE `followed` (
  `UserID` int(11) NOT NULL,
  `VacationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `followed`
--

INSERT INTO `followed` (`UserID`, `VacationID`) VALUES
(88, 289);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `FirstName` varchar(30) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Username` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `LoggedIn` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FirstName`, `LastName`, `Username`, `Password`, `LoggedIn`) VALUES
(6, 'Yarden', 'Mor', 'Yardi', '7c4a8d09ca3762af61e59520943dc26494f8941b', 0),
(86, 'Johnny', 'Depp', 'Johnny', '7c4a8d09ca3762af61e59520943dc26494f8941b', 0),
(87, 'Harrison', 'Ford', 'Ford', '7c4a8d09ca3762af61e59520943dc26494f8941b', 0),
(88, 'Clint', 'Eastwood', 'Clint', '7c4a8d09ca3762af61e59520943dc26494f8941b', 0),
(89, 'Emma', 'Stone', 'Emma', '7c4a8d09ca3762af61e59520943dc26494f8941b', 0),
(90, 'Rachel', 'McAdams', 'Rachel', '7c4a8d09ca3762af61e59520943dc26494f8941b', 0);

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `VacationID` int(11) NOT NULL,
  `Description` text NOT NULL,
  `Destination` varchar(500) NOT NULL,
  `Image` varchar(500) NOT NULL,
  `Start` varchar(10) NOT NULL,
  `End` varchar(10) NOT NULL,
  `Price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`VacationID`, `Description`, `Destination`, `Image`, `Start`, `End`, `Price`) VALUES
(242, 'A Magical vacation is waiting for you!', 'Paris', '0a4382a2e88ab1b9b7b5bed52e29d076.jpg', '2019-10-17', '2019-10-29', 780),
(243, 'Awesome vacation in London, England', 'London', '81af8e1857f7ea0d8ede5338f7b395e1.jpg', '2019-10-21', '2019-10-24', 950),
(254, 'Amazing vacation in Madrid ', 'Madrid', '2fabe50b3930957ef10c73d966e25d98.jpg', '2019-10-23', '2019-10-31', 650),
(255, 'Lets go to beautiful Vienna', 'Vienna', 'aecb64ac2f03ca53abb7d5c203926498.jpg', '2019-10-26', '2019-11-02', 600),
(256, 'Beautiful Amsterdam is waiting for you', 'Amsterdam', '436e0dcbad347812a16cb12bdb9074d5.jpg', '2019-10-26', '2019-10-31', 470),
(257, 'New York here we come!', 'New York', '67d59903447711c306ee77bd7e300478.jpg', '2019-10-29', '2019-11-19', 1500),
(258, 'Amazing Chicago is waiting for you', 'Chicago', 'd1923fc97ed186de2e9995bdcc11cca0.jpg', '2019-11-11', '2019-11-28', 899),
(259, 'ready for non-Stop Hong Kong?', 'Hong Kong', 'af1171ab24e767e9e512403bbb97e650.jpg', '2019-10-31', '2019-11-28', 2000),
(260, 'Beautiful Taipei is waiting for you', 'Taipei', 'd798310ec60838524bfcbeda5d35f14d.jpg', '2019-11-12', '2019-11-30', 1800),
(261, 'Ready for rainy Seattle?', 'Seattle', 'c2a9e74510aa4705c2236189a73d3dc2.jpg', '2019-11-10', '2019-11-30', 1800),
(262, 'Toronto only a flight away', 'Toronto', '4ad866c319e3052794fd4ab04eea14f2.jpg', '2019-10-26', '2019-11-12', 1350),
(263, 'Beautiful Vancouver is waiting for you', 'Vancouver', '372a13d788749b4b1e75b515a5e92d79.jpg', '2019-11-03', '2019-12-03', 1900),
(267, 'Ready for the Kenya?', 'Kenya', '01ee97fbb32e43fb272790344aa783b6.jpg', '2020-01-14', '2020-01-31', 1300),
(268, 'Get ready to hold your breath!', 'Laos', '8bad09d82484de07130efa300575d550.jpg', '2019-10-22', '2019-11-12', 1200),
(269, 'Cuba Havana only today!', 'Cuba', '9d9bd5db665c13d330026020701b3887.jpg', '2019-10-28', '2019-11-28', 899),
(270, 'Ready for colorful Barcelona', 'Barcelona', '6eee56d0b2b6095d2360780068d8ecb8.jpg', '2019-11-17', '2019-11-23', 780),
(271, 'Get ready for the amazing Leh, Ladakh', 'Leh- Ladakh', '6f77ce02672e84884da646d1bff95548.jpg', '2019-11-17', '2019-12-27', 1130),
(272, 'Ready to see the Aurora', 'Iceland', '07879b3d55110c96d2d447c4ef491eb5.jpg', '2019-11-30', '2019-12-20', 3100),
(273, 'Ready to see the Alps?', 'Switzerland', '4a90da99a2f559a45eeab7ff5c607b56.jpg', '2019-11-19', '2019-11-30', 1450),
(274, 'Ready for some Samba ', 'Rio De Janeiro', '0ece7d47119b71271fab8fcb8e9d4ff8.jpg', '2020-02-01', '2020-02-29', 1200),
(275, 'Ready to see the pyramids?\nHope on the next camel and it will take you there', 'Egypt', '06bfa78c07e27de9c9c8c1cd1c6a4065.jpg', '2019-10-22', '2019-10-30', 799),
(289, 'Sydney, here we come!', 'Sydney', '3c873b72a58ff7cd12ede13100cca739.jpg', '2019-11-06', '2019-12-20', 2500),
(290, 'Are you ready to have some juicy pineapples on the beach?\nSunny Thailand is waiting for you!', 'Tahiland', '7ff64e7d994d4a20365b46c8d5a665d6.jpg', '2019-11-11', '2019-12-31', 1750),
(293, 'Are you ready to have the time of your life? Travel with us to the Maldives', 'Maldives', '544c8d63fd28e73d3ed66033b17eeb9e.jpg', '2019-11-13', '2019-12-13', 1750);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`AdminID`);

--
-- Indexes for table `followed`
--
ALTER TABLE `followed`
  ADD PRIMARY KEY (`UserID`,`VacationID`),
  ADD KEY `VacationID` (`VacationID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`VacationID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `AdminID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `VacationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=345;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followed`
--
ALTER TABLE `followed`
  ADD CONSTRAINT `followed_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `followed_ibfk_2` FOREIGN KEY (`VacationID`) REFERENCES `vacations` (`VacationID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
