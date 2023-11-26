INSERT INTO authors (name, bio)
VALUES ('J.K. Rowling', 'British author, best known for the Harry Potter series.'),
       ('George Orwell', 'English novelist, essayist, journalist, and critic.'),
       ('Harper Lee', 'American novelist widely known for To Kill a Mockingbird.'),
       ('Agatha Christie', 'British writer known for her detective novels.'),
       ('Stephen King', 'American author of horror, supernatural fiction, suspense, and fantasy novels.'),
       ('Isaac Asimov', 'American writer and professor of biochemistry, known for his works of science fiction.'),
       ('Jane Austen', 'English novelist known primarily for her six major novels.'),
       ('Leo Tolstoy', 'Russian writer who is regarded as one of the greatest authors of all time.');

-- Books by J.K. Rowling
INSERT INTO books (title, author_id, published_date, isbn)
VALUES ('Harry Potter and the Philosopher''s Stone', 1, '1997-06-26', '9780747532743'),
       ('Harry Potter and the Chamber of Secrets', 1, '1998-07-02', '9780747538493'),
       ('Harry Potter and the Prisoner of Azkaban', 1, '1999-07-08', '9780747542155'),
       ('Harry Potter and the Goblet of Fire', 1, '2000-07-08', '9780747546245'),
       ('Harry Potter and the Order of the Phoenix', 1, '2003-06-21', '9780747551004'),
       ('Harry Potter and the Half-Blood Prince', 1, '2005-07-16', '9780747581087'),
       ('Harry Potter and the Deathly Hallows', 1, '2007-07-21', '9780747591055'),
       ('The Tales of Beedle the Bard', 1, '2008-12-04', '9780545128285'),
       ('Fantastic Beasts and Where to Find Them', 1, '2001-03-01', '9781338132311'),
       ('Quidditch Through the Ages', 1, '2001-03-01', '9781338125740'),
       ('The Casual Vacancy', 1, '2012-09-27', '9780316228534'),
       ('The Cuckoo''s Calling', 1, '2013-04-30', '9780316206846'),
       ('The Silkworm', 1, '2014-06-19', '9780316206877'),
       ('Career of Evil', 1, '2015-10-20', '9780316349932'),
       ('Lethal White', 1, '2018-09-18', '9780316422734'),
       ('Troubled Blood', 1, '2020-09-15', '9780316498937'),
       ('Harry Potter: A History of Magic', 1, '2017-10-20', '9781408890769'),
       ('Harry Potter and the Cursed Child', 1, '2016-07-31', '9780751565362'),
       ('Fantastic Beasts: The Crimes of Grindelwald', 1, '2018-11-16', '9781338263893'),
       ('Harry Potter and the Sorcerer''s Stone: Illustrated Edition', 1, '2015-10-06', '9780545790352');

-- Books by George Orwell
INSERT INTO books (title, author_id, published_date, isbn)
VALUES ('1984', 2, '1949-06-08', '9780451524935'),
       ('Animal Farm', 2, '1945-08-17', '9780451526342'),
       ('Homage to Catalonia', 2, '1938-04-25', '9780156421171'),
       ('Burmese Days', 2, '1934-10-25', '9780156148504'),
       ('The Road to Wigan Pier', 2, '1937-03-08', '9780156767507'),
       ('Coming Up for Air', 2, '1939-06-12', '9780156196253'),
       ('Keep the Aspidistra Flying', 2, '1936-04-20', '9780156468990'),
       ('Down and Out in Paris and London', 2, '1933-01-09', '9780156262246'),
       ('A Clergyman''s Daughter', 2, '1935-03-11', '9780156180656'),
       ('Inside the Whale and Other Essays', 2, '1940-03-11', '9780140011852'),
       ('The Lion and the Unicorn', 2, '1941-02-19', '9780141393056'),
       ('Essays', 2, '1968-01-01', '9780141395463'),
       ('Facing Unpleasant Facts', 2, '1937-01-01', '9780151010264'),
       ('All Art Is Propaganda', 2, '1946-01-01', '9780156033077'),
       ('Shooting an Elephant', 2, '1950-01-01', '9780151820436'),
       ('England Your England', 2, '1953-01-01', '9780141196356'),
       ('The Orwell Reader', 2, '1956-01-01', '9780156701761'),
       ('Such, Such Were the Joys', 2, '1953-01-01', '9780156901776'),
       ('Orwell in Spain', 2, '2001-01-01', '9780141185169'),
       ('Lost Orwell', 2, '2006-01-01', '9781845293032');

-- Books by Harper Lee
INSERT INTO books (title, author_id, published_date, isbn)
VALUES ('To Kill a Mockingbird', 3, '1960-07-11', '9780061120084'),
       ('Go Set a Watchman', 3, '2015-07-14', '9780062409850');

-- Books by Agatha Christie
INSERT INTO books (title, author_id, published_date, isbn)
VALUES ('The Mysterious Affair at Styles', 4, '1920-10-01', '9780007119271'),
       ('The Murder on the Links', 4, '1923-05-01', '9780007119288'),
       ('The Murder of Roger Ackroyd', 4, '1926-06-01', '9780007119295'),
       ('The Mystery of the Blue Train', 4, '1928-03-29', '9780007119301'),
       ('Peril at End House', 4, '1932-02-01', '9780007119318'),
       ('Lord Edgware Dies', 4, '1933-09-01', '9780007119325'),
       ('Murder on the Orient Express', 4, '1934-01-01', '9780007119332'),
       ('Three Act Tragedy', 4, '1935-01-01', '9780007119349'),
       ('Death on the Nile', 4, '1937-11-01', '9780007119356'),
       ('Appointment with Death', 4, '1938-05-02', '9780007119363'),
       ('Hercule Poirot''s Christmas', 4, '1938-12-19', '9780007119370'),
       ('Sad Cypress', 4, '1940-03-01', '9780007119387'),
       ('One, Two, Buckle My Shoe', 4, '1940-11-01', '9780007119394'),
       ('Evil Under the Sun', 4, '1941-06-01', '9780007119400'),
       ('Five Little Pigs', 4, '1942-05-01', '9780007119417'),
       ('The Hollow', 4, '1946-11-01', '9780007119424'),
       ('The Labours of Hercules', 4, '1947-09-01', '9780007119431'),
       ('Taken at the Flood', 4, '1948-03-01', '9780007119448'),
       ('A Murder Is Announced', 4, '1950-06-01', '9780007119455'),
       ('They Do It with Mirrors', 4, '1952-11-17', '9780007119462');

-- Books by Stephen King
INSERT INTO books (title, author_id, published_date, isbn)
VALUES ('Carrie', 5, '1974-04-05', '9780307743664'),
       ('Salem''s Lot', 5, '1975-10-17', '9780307743671'),
       ('The Shining', 5, '1977-01-28', '9780307743657'),
       ('The Stand', 5, '1978-10-03', '9780307743688'),
       ('The Dead Zone', 5, '1979-08-30', '9780451155757'),
       ('Firestarter', 5, '1980-09-29', '9780451167804'),
       ('Cujo', 5, '1981-09-08', '9780451161352'),
       ('Christine', 5, '1983-04-29', '9780451160447'),
       ('Pet Sematary', 5, '1983-11-14', '9780451162076'),
       ('It', 5, '1986-09-15', '9780450411434'),
       ('Misery', 5, '1987-06-08', '9780451169525'),
       ('The Tommyknockers', 5, '1987-11-10', '9780451156600'),
       ('The Dark Half', 5, '1989-10-20', '9780451167316'),
       ('Needful Things', 5, '1991-10-01', '9780451172815'),
       ('Gerald''s Game', 5, '1992-05-15', '9780451176462'),
       ('Dolores Claiborne', 5, '1993-11-01', '9780451185464'),
       ('Insomnia', 5, '1994-09-15', '9780451186652'),
       ('Rose Madder', 5, '1995-06-01', '9780451186362'),
       ('The Green Mile', 5, '1996-08-29', '9780451933027'),
       ('Desperation', 5, '1996-09-01', '9780451188465');

-- Books by Isaac Asimov
INSERT INTO books (title, author_id, published_date, isbn)
VALUES ('I, Robot', 6, '1950-12-02', '9780553803709'),
       ('Foundation', 6, '1951-08-21', '9780553803716'),
       ('Foundation and Empire', 6, '1952-10-01', '9780553803723'),
       ('Second Foundation', 6, '1953-01-01', '9780553803730'),
       ('The Caves of Steel', 6, '1954-10-01', '9780553293401'),
       ('The End of Eternity', 6, '1955-08-01', '9780765319197'),
       ('The Naked Sun', 6, '1957-01-01', '9780553293395'),
       ('The Robots of Dawn', 6, '1983-01-01', '9780553299496'),
       ('Robots and Empire', 6, '1985-08-01', '9780586062005'),
       ('Foundation''s Edge', 6, '1982-10-01', '9780553803747'),
       ('Foundation and Earth', 6, '1986-08-01', '9780586071106'),
       ('Prelude to Foundation', 6, '1988-05-01', '9780553278392'),
       ('Forward the Foundation', 6, '1993-04-01', '9780553565072'),
       ('The Gods Themselves', 6, '1972-03-01', '9780553288100'),
       ('The Martian Way and Other Stories', 6, '1955-11-01', '9780553293357'),
       ('Nightfall and Other Stories', 6, '1969-01-01', '9780553290998'),
       ('The Bicentennial Man and Other Stories', 6, '1976-02-01', '9780553293371'),
       ('The Stars, Like Dust ', 6, ' 1951-01-01', ' 9780765319159 '),
       (' Pebble in the Sky ', 6, ' 1950-01-01', ' 9780345339349 '),
       (' The Currents of Space ', 6, ' 1952-01-01', ' 9780765319180 ');

-- Books by Jane Austen
INSERT INTO books (title, author_id, published_date, isbn)
VALUES ('Sense and Sensibility', 7, '1811-10-30', '9780141439662'),
       ('Pride and Prejudice', 7, '1813-01-28', '9780679783268'),
       ('Mansfield Park', 7, '1814-07-09', '9780141439808'),
       ('Emma', 7, '1815-12-25', '9780141439587'),
       ('Northanger Abbey', 7, '1817-12-01', '9780141439792'),
       ('Persuasion', 7, '1817-12-01', '9780141439686'),
       ('Lady Susan', 7, '1871-01-01', '9780140431025');

-- Books by Leo Tolstoy
INSERT INTO books (title, author_id, published_date, isbn)
VALUES ('War and Peace', 8, '1869-01-01', '9781400079988'),
       ('Anna Karenina', 8, '1877-01-01', '9780679783305'),
       ('The Death of Ivan Ilyich', 8, '1886-01-01', '9780553210354'),
       ('Resurrection', 8, '1899-01-01', '9780486432167'),
       ('Childhood', 8, '1852-01-01', '9780140441390'),
       ('Boyhood', 8, '1854-01-01', '9780140445220'),
       ('Youth', 8, '1857-01-01', '9780140444667'),
       ('The Cossacks', 8, '1863-01-01', '9780486432167'),
       ('Hadji Murat', 8, '1912-01-01', '9780375762456'),
       ('The Kreutzer Sonata', 8, '1889-01-01', '9780486452462'),
       ('The Kingdom of God Is Within You', 8, '1894-01-01', '9780486451380'),
       ('What Is Art?', 8, '1897-01-01', '9780486406533'),
       ('A Confession', 8, '1882-01-01', '9780486451458'),
       ('Family Happiness', 8, '1859-01-01', '9780140449105'),
       ('Master and Man', 8, '1895-01-01', '9780486419267'),
       ('Father Sergius', 8, '1911-01-01', '9781603863304'),
       ('The Snowstorm', 8, '1856-01-01', '9780140449600'),
       ('Two Hussars', 8, '1856-01-01', '9780140449600'),
       ('Sevastopol Sketches', 8, '1855-01-01', '9780140444681'),
       ('The Forged Coupon', 8, '1911-01-01', '9781603863304');
