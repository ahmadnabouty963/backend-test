# Authentifizierung und Autorisierung

Authentifizierung bedeutet in diesem Projekt, dass die Identität eines Benutzers überprüft wird.

Beim Login werden die E-Mail-Adresse und das Passwort geprüft.

Nach einem erfolgreichen Login erzeugt der Server ein Token und speichert dessen Zuordnung zum Benutzer.

Die Middleware `authenticate` prüft das Token und hängt den gefundenen Benutzer an `req.user`.

Autorisierung bedeutet, dass geprüft wird, auf welche Bereiche ein authentifizierter Benutzer zugreifen darf.

Die Route `/admin` verwendet `requireAdmin` und erlaubt nur Benutzern mit der Rolle `admin` den Zugriff.

wer bist du und was darst du ?

401 = Du bist nicht gültig angemeldet.

403 = Du bist angemeldet, hast aber nicht die erforderliche Berechtigung.
