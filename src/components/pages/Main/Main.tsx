import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { fetchReposByOrg } from 'api/github';

import MainLayout from 'components/layouts/MainLayout';
import Card from 'components/dummies/Card';
import Input from 'components/ui/Input';
import IconButton from 'components/ui/IconButton';
import Loader from 'components/ui/Loader';
import MultiDropdown from 'components/ui/MultiDropdown';
import { Link } from '@tanstack/react-router';

import searchIcon from 'assets/icons/common/search-icon.svg';
import starIcon from 'assets/icons/common/star.svg';

import styles from './styles.module.scss';
import inputStyles from 'components/ui/Input/styles.module.scss';
import cardStyles from 'components/dummies/Card/styles.module.scss';
import iconButtonStyles from 'components/ui/IconButton/styles.module.scss';
import dropDownStyles from 'components/ui/MultiDropdown/styles.module.scss';

interface Repository {
  id: number;
  name: string;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  stargazers_count: number;
  pushed_at: string; 
}


const Main = () => {
  const [orgName, setOrgName] = useState('');
  const [queryOrg, setQueryOrg] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const { data: repos = [], isLoading, isError } = useQuery<Repository[]>({
    queryKey: ['repos', queryOrg],
    queryFn: () => fetchReposByOrg(queryOrg),
    enabled: !!queryOrg,
  });

  const languages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language) set.add(repo.language);
    });
    return Array.from(set);
  }, [repos]);

  const sortedRepos = useMemo(() => {
    return [...repos].sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
  }, [repos]);
  

  const filteredRepos = useMemo(() => {
    if (!selectedLanguages.length) return sortedRepos;
    return sortedRepos.filter((repo) => selectedLanguages.includes(repo.language || '')) || [];
  }, [sortedRepos, selectedLanguages]);
  

  return (
    <MainLayout>
      <div className={styles.mainRoot}>
        <div className={styles.search}>
          <Input
            className={inputStyles.input}
            placeholder="Enter organization name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
          <IconButton
            className={iconButtonStyles.iconButton}
            icon={searchIcon}
            onClick={() => setQueryOrg(orgName)}
          />
        </div>

        <div className={styles.repoLanguages}>
          {filteredRepos.length > 0 && (
            <div className={styles.repoHeader}>
              <h2>Repositories</h2>
              {languages.length > 0 && (
                <MultiDropdown
                  options={languages.map((lang) => ({ value: lang, label: lang }))}
                  value={selectedLanguages}
                  onChange={setSelectedLanguages}
                  selectClassName={dropDownStyles.multiDropdownS}
                  optionsClassName={dropDownStyles.multiDropdown}
                  />
                )}
            </div>
          )}
        </div>
        


        {isLoading && <Loader color="second" size="L" />}
        {isError && <p style={{ color: 'red' }}>Error loading repositories</p>}

        <div className={styles.repositories}>
          {filteredRepos.map((repo) => (
          <Link key={repo.id} to={`/repository/${repo.owner.login}/${repo.name}`}>
            <Card
              image={repo.owner.avatar_url}
              title={repo.name}
              subtitle={repo.owner.login}
              className={cardStyles.card}
            >
              <div>
                <img src={starIcon} />
                <span>{repo.stargazers_count}</span>
              </div>
              
              <p>Updated{' '}
                {new Date(repo.pushed_at).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                })}</p>


            </Card>
          </Link>
        ))}
        </div>
        
      </div>
    </MainLayout>
  );
};

export default Main;