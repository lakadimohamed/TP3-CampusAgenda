
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

// =====================================
// ÉTAPE 1 : DONNÉES ET CALCULS
// =====================================

// 1. Définition du type Evenement
type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

// 2. Tableau des événements
const evenements: Evenement[] = [
  {
    id: 'E01',
    titre: 'Atelier React',
    categorie: 'Atelier',
    capacite: 25,
    inscrits: 25,
  },
  {
    id: 'E02',
    titre: 'Conférence IA',
    categorie: 'Conférence',
    capacite: 70,
    inscrits: 52,
  },
  {
    id: 'E03',
    titre: 'Sécurité mobile',
    categorie: 'Atelier',
    capacite: 20,
    inscrits: 17,
  },
  {
    id: 'E04',
    titre: 'Design UI',
    categorie: 'Atelier',
    capacite: 18,
    inscrits: 9,
  },
  {
    id: 'E05',
    titre: 'Forum projets',
    categorie: 'Rencontre',
    capacite: 50,
    inscrits: 49,
  },
  {
    id: 'E06',
    titre: 'Découverte Git',
    categorie: 'Atelier',
    capacite: 24,
    inscrits: 24,
  },
];

// 3. Calculer les places restantes
function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

// 4. Déterminer le statut de chaque événement
type StatutEvenement =
  | 'Complet'
  | 'Presque complet'
  | 'Ouvert';

function statutEvenement(e: Evenement): StatutEvenement {
  const places = placesRestantes(e);

  if (places === 0) {
    return 'Complet';
  } else if (places <= 3) {
    return 'Presque complet';
  } else {
    return 'Ouvert';
  }
}

// 5. Calculer les indicateurs globaux
const totalEvenements = evenements.length;

const evenementsComplets = evenements.filter(
  e => placesRestantes(e) === 0
).length;

const evenementsAvecPlaces = evenements.filter(
  e => placesRestantes(e) > 0
).length;

const totalPlacesRestantes = evenements.reduce(
  (total, e) => total + placesRestantes(e),
  0
);

// 6. Préparer les ateliers disponibles
const ateliersDisponibles = evenements.filter(
  e =>
    e.categorie === 'Atelier' &&
    placesRestantes(e) > 0
);

// =====================================
// ÉTAPE 2 : COMPOSANTS RÉUTILISABLES
// =====================================

// 1. Composant BadgeEtat
type BadgeEtatProps = {
  statut: StatutEvenement;
};

function BadgeEtat({ statut }: BadgeEtatProps) {
  let couleur = styles.badgeOuvert;

  if (statut === 'Complet') {
    couleur = styles.badgeComplet;
  } else if (statut === 'Presque complet') {
    couleur = styles.badgePresque;
  }

  return (
    <View style={[styles.badge, couleur]}>
      <Text style={styles.badgeTexte}>
        {statut}
      </Text>
    </View>
  );
}

// 2. Composant CarteEvenement
type CarteEvenementProps = {
  evenement: Evenement;
};

function CarteEvenement({
  evenement,
}: CarteEvenementProps) {
  const places = placesRestantes(evenement);
  const statut = statutEvenement(evenement);

  return (
    <View style={styles.carte}>
      <Text style={styles.titreCarte}>
        {evenement.titre}
      </Text>

      <Text style={styles.categorie}>
        Catégorie : {evenement.categorie}
      </Text>

      <Text style={styles.places}>
        Places restantes : {places}
      </Text>

      <BadgeEtat statut={statut} />
    </View>
  );
}

// 3. Composant BlocStatistique
type BlocStatistiqueProps = {
  libelle: string;
  valeur: number;
};

function BlocStatistique({
  libelle,
  valeur,
}: BlocStatistiqueProps) {
  return (
    <View style={styles.blocStatistique}>
      <Text style={styles.valeurStatistique}>
        {valeur}
      </Text>

      <Text style={styles.libelleStatistique}>
        {libelle}
      </Text>
    </View>
  );
}

// =====================================
// ÉTAPE 3 ET 4 : INTERFACE ET MODES
// =====================================

// Mode d'affichage : 'tous' ou 'ateliers'
const mode: 'tous' | 'ateliers' = 'tous';

// Titre selon le mode choisi
const titreMode =
  mode === 'tous'
    ? 'Tous les événements'
    : 'Ateliers disponibles';

// Liste des événements à afficher
const evenementsAffiches =
  mode === 'tous'
    ? evenements
    : ateliersDisponibles;

// =====================================
// ÉTAPE 5 : APPLICATION ET FLATLIST
// =====================================

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.titrePrincipal}>
          CampusAgenda
        </Text>
      </View>

      <Text style={styles.sousTitre}>
        Événements du campus
      </Text>

      {/* Statistiques */}
      <View style={styles.statistiques}>
        <BlocStatistique
          libelle="événements"
          valeur={totalEvenements}
        />

        <BlocStatistique
          libelle="places libres"
          valeur={totalPlacesRestantes}
        />
      </View>

      {/* Titre du mode */}
      <Text style={styles.titreMode}>
        {titreMode}
      </Text>

      {/* Liste des événements */}
      <FlatList
        data={evenementsAffiches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarteEvenement evenement={item} />
        )}
        ListEmptyComponent={
          <Text style={styles.messageVide}>
            Aucun événement à afficher pour le moment.
          </Text>
        }
        contentContainerStyle={styles.liste}
      />
    </View>
  );
}

// =====================================
// STYLES DE L'APPLICATION
// =====================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5fa',
    paddingTop: 45,
    paddingHorizontal: 18,
  },

  header: {
    backgroundColor: '#10418e',
    padding: 22,
    borderRadius: 25,
    alignItems: 'center',
  },

  titrePrincipal: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  sousTitre: {
    fontSize: 20,
    color: '#5b6170',
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 38,
  },

  statistiques: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 50,
  },

  blocStatistique: {
    flex: 1,
    backgroundColor: '#e5efff',
    borderWidth: 1.5,
    borderColor: '#c7d5ee',
    borderRadius: 25,
    paddingVertical: 30,
    alignItems: 'center',
  },

  valeurStatistique: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#10418e',
  },

  libelleStatistique: {
    fontSize: 19,
    color: '#10418e',
    marginTop: 12,
  },

  titreMode: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#10418e',
    marginBottom: 35,
  },

  liste: {
    paddingBottom: 25,
  },

  carte: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#c7d5ee',
    borderRadius: 22,
    padding: 22,
    marginBottom: 30,
  },

  titreCarte: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#10418e',
    marginBottom: 14,
  },

  categorie: {
    fontSize: 18,
    color: '#606060',
    marginBottom: 12,
  },

  places: {
    fontSize: 18,
    color: '#222222',
    marginBottom: 20,
  },

  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 15,
  },

  badgeTexte: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  badgeComplet: {
    backgroundColor: '#f6d9dd',
  },

  badgePresque: {
    backgroundColor: '#fff1c9',
  },

  badgeOuvert: {
    backgroundColor: '#d3e8df',
  },

  messageVide: {
    fontSize: 18,
    color: '#777777',
    textAlign: 'center',
    marginTop: 65,
  },
});
