import { Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  fetchRepoDetails,
  fetchRepoCommitActivity,
  fetchRepoContributors,
  fetchRepoBranches,
} from 'api/github';
import MainLayout from 'components/layouts/MainLayout';
import Loader from 'components/ui/Loader';
import styles from './styles.module.scss';
import backIcon from 'assets/icons/common/back.svg';
import starsIcon from 'assets/icons/common/star.svg';
import forksIcon from 'assets/icons/common/forks.svg';
import openIssuesIcon from 'assets/icons/common/openIssues.svg';
import watchersIcon from 'assets/icons/common/watchers.svg';



type CommitWeek = {
  week: number;
  days: number[];
};

type MatrixDay = {
  date: string;
  count: number;
};

const generateContributionsGrid = (activity: CommitWeek[]) => {
  const matrix: MatrixDay[][] = Array.from({ length: 7 }, () => Array(30).fill(null));
  const today = new Date();
  const dayOfWeek = today.getDay(); 
  const daysSinceSaturday = (dayOfWeek + 1) % 7;
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - daysSinceSaturday);

  const last30Weeks = activity.slice(-30);

  last30Weeks.forEach((week, weekIndex) => {
    
    const weekStart = new Date(week.week * 1000); 
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + dayIndex); 
      
      if (date <= endDate) {
        matrix[dayIndex][weekIndex] = {
          date: date.toISOString().split('T')[0],
          count: week.days[dayIndex] ?? 0,
        };
      }
    }
  });

  return matrix;
};



const getMonthPositions = (matrix: (MatrixDay | null)[][]) => {
  const positions: { name: string; index: number }[] = [];
  const seen = new Set<string>();

  for (let col = 0; col < 30; col++) {
    for (let row = 0; row < 7; row++) {
      const day = matrix[row][col];
      if (day) {
        const date = new Date(day.date);
        const month = date.toLocaleString('en-US', { month: 'short' });

        if (!seen.has(month)) {
          seen.add(month);
          positions.push({ name: month, index: col });
        }

        break;
      }
    }
  }

  return positions;
};





const Repository = () => {
  const { owner, repo } = useParams({ strict: false });

  const { data: repoData, isLoading: isRepoLoading } = useQuery({
    queryKey: ['repoDetails', owner, repo],
    queryFn: () => fetchRepoDetails(owner, repo),
  });

  const { data: activity = [] } = useQuery({
    queryKey: ['commitActivity', owner, repo],
    queryFn: () => fetchRepoCommitActivity(owner, repo),
  });

  const { data: contributors = [] } = useQuery({
    queryKey: ['contributors', owner, repo],
    queryFn: () => fetchRepoContributors(owner, repo),
  });

  const { data: branches = [] } = useQuery({
    queryKey: ['branches', owner, repo],
    queryFn: () => fetchRepoBranches(owner, repo),
  });

  const matrix = generateContributionsGrid(activity || []);
  const monthPositions = getMonthPositions(matrix);

  if (isRepoLoading || !repoData) return <Loader color="second" size="L" />;

  return (
    <MainLayout>
      <div className={styles.repoPage}>
        <div className={styles.header}>
          <Link to="/" className={styles.backIcon}>
              <img src={backIcon} alt="Back" />
          </Link>
          <img src={repoData.owner.avatar_url} alt="avatar" className={styles.avatarRepo} />
          <h1>{repoData.name}</h1>
        </div>

     
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <img src={starsIcon} alt="Stars" />
            <span>{repoData.stargazers_count}</span>
          </div>
          <div className={styles.statItem}>
            <img src={watchersIcon} alt="Watchers" />
            <span>{repoData.subscribers_count}</span>
          </div>
          <div className={styles.statItem}>
            <img src={forksIcon} alt="Forks" />
            <span>{repoData.forks_count}</span>
          </div>
          <div className={styles.statItem}>
            <img src={openIssuesIcon} alt="Issues" />
            <span>{repoData.open_issues_count}</span>
          </div>
        </div>

        

        <h2>Description</h2>
        <p>{repoData.description || 'No description provided.'}</p>



        <h2>Contributions</h2>
        <div className={styles.monthLabels}>
          {monthPositions.map(({ name, index }) => (
            <span key={name} className={styles.monthLabel} style={{ gridColumnStart: index + 1 }}>
              {name}
              </span>
            ))}
        </div>
            {Array.from({ length: 7 }).map((_, rowIndex) => (
              <div className={styles.dayRow} key={rowIndex}>
                {Array.from({ length: 30 }).map((_, colIndex) => {
                  const day = matrix[rowIndex][colIndex];
                  return (
                  <div
                  key={`${colIndex}-${rowIndex}`}
                  className={`${styles.activityDay} ${styles[
                    !day
                    ? 'level0'
                    : day.count > 5
                    ? 'level3'
                    : day.count > 1
                    ? 'level2'
                    : day.count === 1
                    ? 'level1'
                    : 'level0'
                  ]}`}
                  />
                );
                })}
                </div>
              ))}


        <h2>Contributors</h2>
        <div className={styles.contributors}>
          {contributors.map((user: any) => (
            <img
            key={user.id}
            src={user.avatar_url}
            alt={user.login}
            className={styles.avatar}
            title={user.login}
            />
          ))}
        </div>
     
        
        <h2>Branches List</h2>
        <ul className={styles.branchList}>
          {branches.map((branch: any) => (
            <li key={branch.name}>
              {branch.name} {branch.protected && <span className={styles.branchProtected}>• PROTECTED</span>}
            </li>    
          ))}
        </ul>
      </div>

      

    </MainLayout>
  );
};

export default Repository;