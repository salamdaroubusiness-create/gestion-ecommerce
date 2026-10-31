# Plateforme e-commerce GSC Business Center : version Supabase + GitHub Pages

Site statique (GitHub Pages) + comptes et base de données gérés par Supabase. Aucun serveur à maintenir.

## Mise en place

1. **Supabase** : créez un projet sur supabase.com.
2. **Base de données** : ouvrez *SQL Editor*, collez le contenu de `schema.sql` et exécutez-le.
3. **Clés** : l’URL du projet (bouton *Connect* ou *Project Settings*) et la clé publique dans *Project Settings > API Keys* : la **Publishable key** (`sb_publishable_...`) ou, à défaut, la clé **anon** de l’onglet *Legacy API Keys*. Copiez-les dans `config.js`. Ne mettez jamais la clé *secret* ou `service_role` dans le site. Si le site affiche « Invalid API key », essayez l’autre type de clé.
4. **GitHub** : créez un dépôt, envoyez tous ces fichiers, puis *Settings > Pages* : « Deploy from a branch », branche `main`, dossier `/ (root)`.
5. **Supabase > Authentication > URL Configuration** : mettez l’adresse de votre site GitHub Pages dans *Site URL* (sinon les liens de confirmation d’e-mail pointent au mauvais endroit).
6. **Premier administrateur** : créez un compte sur le site, confirmez l’e-mail, puis exécutez dans le SQL Editor la ligne `update public.profiles set role = 'admin' ...` (en bas de `schema.sql`) avec votre adresse. Reconnectez-vous : l’onglet Administration apparaît.

## Droits (appliqués par la base, pas seulement par le site)

- **Client** : lit et modifie uniquement sa propre boutique.
- **Administrateur** : lit tous les clients, publie l’annonce, supprime un compte. Il ne modifie pas les données d’un client.
- Un client ne peut pas se donner le rôle admin : aucune règle ne l’autorise.

## Points d’attention

- E-mails de confirmation : Supabase en envoie très peu par heure avec son service par défaut. Pour un vrai lancement, configurez votre propre SMTP (*Authentication > SMTP*).
- Les projets gratuits Supabase peuvent être mis en pause après une période d’inactivité : vérifiez les conditions en vigueur.
- Sauvegardes : vérifiez ce qu’inclut votre offre, ou exportez régulièrement les tables `shops` et `profiles`.
- Mot de passe oublié : non inclus dans cette version.
- La bibliothèque Supabase est chargée depuis jsDelivr (version fixée).
